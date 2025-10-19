import { useEffect } from 'preact/hooks'
import { useAuth } from './hooks/use-auth'
import { Router, Route } from 'preact-router'
import { updateSEO, pageSEO } from './utils/seo.util'

// Import pages (these will be created)
import LoginPage from './pages/admin/login'
import SkillsPage from './pages/admin/skills'
import KanbanPage from './pages/admin/kanban'
import ProfilePage from './pages/admin/profile'
import ProjectsPage from './pages/admin/projects'
import DashboardPage from './pages/admin/dashboard'
import ExperiencesPage from './pages/admin/experiences'
import BlogReorderPage from './pages/admin/blogReorder'
import VolunteerPage from './pages/admin/volunteer'
import AdminLayout from './components/layout/AdminLayout'
import CertificationsPage from './pages/admin/certifications'

function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuth()

  useEffect(() => {
    initializeAuth()
    // Ensure favicons and basic SEO on app mount
    updateSEO()
  }, [initializeAuth])

  // Handle route changes for SEO
  const handleRouteChange = (e: { url?: string }) => {
    const path = e.url || window.location.pathname

    // Determine which page SEO to apply based on route
    if (path.includes('/login')) {
      updateSEO(pageSEO.login)
    } else if (path.includes('/dashboard')) {
      updateSEO(pageSEO.dashboard)
    } else if (path.includes('/profile')) {
      updateSEO(pageSEO.profile)
    } else if (path.includes('/skills')) {
      updateSEO(pageSEO.skills)
    } else if (path.includes('/projects')) {
      updateSEO(pageSEO.projects)
    } else if (path.includes('/experiences')) {
      updateSEO(pageSEO.experiences)
    } else if (path.includes('/volunteer')) {
      updateSEO(pageSEO.volunteer)
    } else if (path.includes('/certifications')) {
      updateSEO(pageSEO.certifications)
    } else if (path.includes('/kanban')) {
      updateSEO(pageSEO.kanban)
    } else if (path.includes('/blogs/reorder')) {
      updateSEO(pageSEO.blogReorder)
    } else {
      updateSEO()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Router onChange={handleRouteChange}>
      <Route path="/admin/login" component={LoginPage} />
      <Route
        path="/admin/dashboard"
        component={() => (
          <AdminLayout>
            <DashboardPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/profile"
        component={() => (
          <AdminLayout>
            <ProfilePage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/skills"
        component={() => (
          <AdminLayout>
            <SkillsPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/projects"
        component={() => (
          <AdminLayout>
            <ProjectsPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/experiences"
        component={() => (
          <AdminLayout>
            <ExperiencesPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/volunteer"
        component={() => (
          <AdminLayout>
            <VolunteerPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/certifications"
        component={() => (
          <AdminLayout>
            <CertificationsPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/kanban"
        component={() => (
          <AdminLayout>
            <KanbanPage />
          </AdminLayout>
        )}
      />
      <Route
        path="/admin/blogs/reorder"
        component={() => (
          <AdminLayout>
            <BlogReorderPage />
          </AdminLayout>
        )}
      />
      <Route
        default
        component={() => {
          if (typeof window !== 'undefined') {
            window.location.href = isAuthenticated ? '/admin/dashboard' : '/admin/login'
          }
          return null
        }}
      />
    </Router>
  )
}

export default App
