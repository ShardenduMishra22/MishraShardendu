import { forwardRef } from 'preact/compat'
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import type { JSX } from 'preact'
import { useEffect } from 'preact/hooks'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: JSX.Element | JSX.Element[]
}

type DialogContextType = {
  onOpenChange?: (open: boolean) => void
} | null

const DialogContext = createContext<DialogContextType>(null)

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null
  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div>{children}</div>
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({
  children,
  onClick,
}: {
  children: JSX.Element | JSX.Element[]
  onClick?: () => void
}) => {
  return <div onClick={onClick}>{children}</div>
}

const DialogPortal = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return <div>{children}</div>
}

const DialogClose = ({
  children,
  onClick,
}: {
  children?: JSX.Element | JSX.Element[]
  onClick?: () => void
}) => {
  return <div onClick={onClick}>{children}</div>
}

const DialogOverlay = forwardRef<HTMLDivElement, JSX.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('fixed inset-0 z-50 bg-black/80', className)} {...props} />
  )
)
DialogOverlay.displayName = 'DialogOverlay'

interface DialogContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, onClose, ...props }, ref) => {
    const ctx = useContext(DialogContext)
    const handleClose = onClose ?? (() => ctx?.onOpenChange && ctx.onOpenChange(false))

    return (
      <>
        <DialogOverlay onClick={handleClose} />
        <div
          ref={ref}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-full sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-4 sm:p-6 shadow-lg duration-200 sm:rounded-lg',
            className
          )}
          {...props}
        >
          {children}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: JSX.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: JSX.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = forwardRef<HTMLHeadingElement, JSX.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  JSX.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
