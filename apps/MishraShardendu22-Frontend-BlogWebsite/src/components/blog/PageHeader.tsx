import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-base">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export default PageHeader
