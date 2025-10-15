import { useEffect, useState } from 'preact/hooks'
import { Button } from '../../components/ui/button'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { skillsAPI } from '../../utils/apiResponse.util'
import { Plus, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SkillsPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSkills, setNewSkills] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 21
  const totalPages = Math.ceil(skills.length / itemsPerPage)

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getSkills()
      setSkills(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch {
      setError('Failed to fetch skills')
      setSkills([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleAddSkills = async (e: Event) => {
    e.preventDefault()
    if (!newSkills.trim()) {
      toast.error('Please enter at least one skill')
      return
    }

    setSubmitting(true)
    try {
      const skillsArray = newSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      await skillsAPI.addSkills({ skills: skillsArray })
      toast.success('Skills added successfully')
      setIsAddDialogOpen(false)
      setNewSkills('')
      fetchSkills()
    } catch {
      toast.error('Failed to add skills')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSkill = async (skill: string) => {
    try {
      await skillsAPI.deleteSkill(skill)
      toast.success('Skill deleted successfully')
      fetchSkills()
    } catch {
      toast.error('Failed to delete skill')
    }
  }

  const paginatedSkills = skills.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  if (loading) {
    return (
      <div class="min-h-[40vh] flex items-center justify-center">
        <Loader2 class="w-12 h-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error && !skills.length) {
    return (
      <div class="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 text-center max-w-lg mx-auto">
        <div class="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
          <span class="text-5xl">😢</span>
        </div>
        <h2 class="text-3xl font-bold">Oops! Something went wrong</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">{error}</p>
        <Button onClick={fetchSkills} class="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div class="space-y-8 p-6">
      <header class="text-center space-y-6">
        <h1 class="text-2xl md:text-3xl font-heading font-extrabold bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 bg-clip-text text-transparent leading-tight">
          Skills - Manage your technical skills and competencies
        </h1>
      </header>

      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 border-b pb-4">
        <div>
          <h2 class="text-3xl font-bold text-blue-500 mb-1">Your Skills</h2>
          <p class="text-lg max-w-md">Add your skills below.</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger>
            <Button class="bg-teal-600 hover:bg-teal-700 text-white font-semibold">
              <Plus class="w-4 h-4 mr-2" />
              Add Skills
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Skills</DialogTitle>
              <DialogDescription>
                Enter skills separated by commas (e.g., React, TypeScript, Node.js)
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSkills} class="space-y-4">
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Input
                  id="skills"
                  value={newSkills}
                  onInput={(e) => setNewSkills((e.target as HTMLInputElement).value)}
                  placeholder="React, TypeScript, Node.js"
                  required
                />
              </div>
              <div class="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} class="bg-teal-600 hover:bg-teal-700">
                  {submitting && <Loader2 class="w-4 h-4 mr-2 animate-spin" />}
                  {submitting ? 'Adding...' : 'Add Skills'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && skills.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {skills.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-20 space-y-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border shadow-lg">
          <div class="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center">
            <Plus class="w-10 h-10 text-teal-500" />
          </div>
          <h3 class="text-3xl font-semibold">No skills yet</h3>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-md text-center">
            Get started by adding your first skill.
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg hover:from-teal-600 hover:to-green-600 font-semibold"
          >
            <Plus class="w-5 h-5" />
            Add Skill
          </Button>
        </div>
      ) : (
        <>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
            {paginatedSkills.map((skill) => (
              <div
                key={skill}
                class="group relative bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-teal-200 dark:border-teal-800 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <p class="text-center font-semibold text-gray-800 dark:text-gray-200 pr-6">
                  {skill}
                </p>
                <button
                  onClick={() => handleDeleteSkill(skill)}
                  class="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label={`Delete ${skill}`}
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div class="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-center">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  variant="outline"
                  disabled={currentPage === 0}
                  class="flex items-center gap-1 flex-1 sm:flex-initial"
                >
                  <ChevronLeft class="w-5 h-5" />
                  Prev
                </Button>

                <span class="text-sm font-medium sm:hidden">
                  Page {currentPage + 1} of {totalPages}
                </span>

                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  variant="outline"
                  disabled={currentPage === totalPages - 1}
                  class="flex items-center gap-1 flex-1 sm:flex-initial"
                >
                  Next
                  <ChevronRight class="w-5 h-5" />
                </Button>
              </div>

              <div class="hidden sm:flex items-center gap-2 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    class={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                      currentPage === i
                        ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-teal-200 dark:border-teal-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
