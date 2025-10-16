import { useEffect, useState } from 'preact/hooks'
import {
  useSensor,
  useSensors,
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  KeyboardSensor,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  useSortable,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import type { BlogReorderItem, BlogReorderUpdate } from '../../types/types.data'
import { blogsAPI } from '../../utils/apiResponse.util'
import { Card, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Save, Loader2, AlertCircle, GripVertical, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../hooks/use-auth'

interface SortableCardProps {
  item: BlogReorderItem
}

const SortableCard = ({ item }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.orderId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative border bg-card transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg scale-[0.98]' : 'hover:shadow-md hover:border-primary/30'
      }`}
    >
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors"
            {...attributes}
            {...listeners}
            role="button"
            tabIndex={0}
            aria-roledescription="draggable"
            aria-describedby={`blog-${item.orderId}`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-foreground line-clamp-2 leading-snug">
              {item.title}
            </CardTitle>
          </div>

          <Badge variant="secondary" className="shrink-0 font-mono text-xs h-6 px-2">
            #{item.orderId || 0}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

export default function BlogReorderPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [items, setItems] = useState<BlogReorderItem[]>([])
  const [originalOrder, setOriginalOrder] = useState<Map<number, number>>(new Map())
  const [changedItems, setChangedItems] = useState<{
    id: number
    title: string
    oldOrder: number
    newOrder: number
  }[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) return

    const fetch = async () => {
      try {
        setLoading(true)
        const res = await blogsAPI.getReorderList()
        const data = Array.isArray(res.data) ? res.data : []
        const sorted = data.sort((a, b) => (a.orderId || 0) - (b.orderId || 0))
        setItems(sorted)
        const map = new Map<number, number>()
        sorted.forEach((it) => map.set(it.orderId, it.orderId))
        setOriginalOrder(map)
        setError('')
      } catch (err) {
        console.error('Failed to load blogs reorder list', err)
        setError('Failed to load blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [isAuthenticated, isLoading])

  const handleSave = async () => {
    if (changedItems.length === 0) return

    try {
      setSaving(true)
      const payload: BlogReorderUpdate[] = changedItems.map((c) => ({
        blogId_Old: c.id,
        blogId_New: c.newOrder,
      }))

      await blogsAPI.updateReorder(payload)

      const newMap = new Map(originalOrder)
      changedItems.forEach((c) => newMap.set(c.id, c.newOrder))
      setOriginalOrder(newMap)
      setChangedItems([])
      toast.success('Blogs reordered successfully')
    } catch (err) {
      console.error('Error saving blog order', err)
      toast.error('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    setItems((current) => {
      const oldIndex = current.findIndex((i) => i.orderId === active.id)
      const newIndex = current.findIndex((i) => i.orderId === over.id)

      const newItems = arrayMove(current, oldIndex, newIndex)

      const updated = newItems.map((it, idx) => ({ ...it, orderId: idx + 1 }))

      const changes: { id: number; title: string; oldOrder: number; newOrder: number }[] = []
      updated.forEach((it) => {
        const original = originalOrder.get(it.orderId)
        if (original !== undefined && original !== it.orderId) {
          changes.push({ id: it.orderId, title: it.title, oldOrder: original, newOrder: it.orderId })
        }
      })

      setChangedItems(changes)
      return updated
    })
  }

  const activeItem = items.find((i) => i.orderId === activeId)

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <div className="space-y-1 text-center">
          <p className="text-base font-medium text-foreground">Loading Blogs</p>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">Error Loading Blogs</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // If user not authenticated (owner only) show nothing
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Only owner can access this page</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Blog Reorder</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-14">Reorder blog posts (owner only)</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No Blogs Found</h3>
          <p className="text-sm text-muted-foreground">Blogs will appear here once created</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md h-10 bg-muted p-1">
            <TabsTrigger value="all" className="flex-1 text-sm data-[state=active]:bg-background">
              All Blogs ({items.length})
            </TabsTrigger>
            <TabsTrigger value="changed" className="flex-1 text-sm data-[state=active]:bg-background">
              Changes {changedItems.length > 0 && `(${changedItems.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <SortableContext items={items.map((i) => i.orderId)} strategy={rectSortingStrategy}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((it) => (
                    <SortableCard key={it.orderId} item={it} />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeItem ? (
                  <Card className="shadow-xl border-primary/50 bg-card">
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <CardTitle className="text-base font-medium text-foreground line-clamp-2 flex-1">
                          {activeItem.title}
                        </CardTitle>
                        <Badge variant="secondary" className="font-mono text-xs h-6 px-2">
                          #{activeItem.orderId}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>

          <TabsContent value="changed" className="mt-6 space-y-4">
            {changedItems.length > 0 && (
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {changedItems.length} {changedItems.length === 1 ? 'blog' : 'blogs'} modified
                    </p>
                    <p className="text-xs text-muted-foreground">Click save to apply changes</p>
                  </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}

            {changedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No Changes</h3>
                <p className="text-sm text-muted-foreground">Reorder blogs in the All Blogs tab to see changes</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Blog Title</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Previous</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">New</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {changedItems.map((item) => {
                      const orderChange = item.newOrder - item.oldOrder
                      const isMovedDown = orderChange > 0

                      return (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground truncate max-w-xs">{item.title}</span>
                              <span className="text-xs text-muted-foreground font-mono">ID: {String(item.id).substring(0, 8)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center"><Badge variant="outline" className="font-mono text-xs">#{item.oldOrder}</Badge></td>
                          <td className="px-4 py-3 text-center"><Badge variant="default" className="font-mono text-xs bg-primary">#{item.newOrder}</Badge></td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {isMovedDown ? (<TrendingDown className="h-3.5 w-3.5 text-orange-500" />) : (<TrendingUp className="h-3.5 w-3.5 text-green-500" />)}
                              <span className={`text-sm font-medium ${isMovedDown ? 'text-orange-500' : 'text-green-500'}`}>{Math.abs(orderChange)}</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
