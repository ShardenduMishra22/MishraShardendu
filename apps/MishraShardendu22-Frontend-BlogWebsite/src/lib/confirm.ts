import { writable } from 'svelte/store'

type Resolver = (value: boolean) => void

interface ConfirmState {
  open: boolean
  message: string
  resolver?: Resolver | null
  title?: string
}

const { subscribe, update, set } = writable<ConfirmState>({
  open: false,
  message: '',
  resolver: null,
})

export const confirmStore = {
  subscribe,
  open: (message: string, title?: string) =>
    new Promise<boolean>((resolve) => {
      update(() => ({ open: true, message, resolver: resolve, title }))
    }),
  close: (answer: boolean) => {
    let resolver: Resolver | undefined
    update((s) => {
      resolver = s.resolver || undefined
      return { open: false, message: '', resolver: null }
    })
    // Resolve after state updated
    if (resolver) resolver(answer)
  },
  reset: () => set({ open: false, message: '', resolver: null }),
}

// Convenience function used like: await confirm('Are you sure?')
export const confirm = (message: string, title?: string) => confirmStore.open(message, title)

export default confirm
