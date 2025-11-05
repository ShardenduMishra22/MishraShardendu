import { MetadataRoute } from 'next'
import { BASE_URL } from '@/constants/url'
import { projectsAPI } from '@/util/apiResponse.util'

async function getProjects() {
  try {
    const response = await projectsAPI.getAllProjects()
    return Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
    return []
  }
}

async function getExperiences() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/experiences`
    )
    const data = await response.json()
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching experiences for sitemap:', error)
    return []
  }
}

async function getVolunteer() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/volunteer`
    )
    const data = await response.json()
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching volunteer for sitemap:', error)
    return []
  }
}

async function getCertifications() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/certifications`
    )
    const data = await response.json()
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching certifications for sitemap:', error)
    return []
  }
}

async function getBlogs() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs`
    )
    const data = await response.json()
    return Array.isArray(data.data) ? data.data : []
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
    return []
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL
  const currentDate = new Date()

  // Fetch all dynamic data in parallel for better performance
  const [projects, blogs, experiences, volunteer, certifications] = await Promise.all([
    getProjects(),
    getBlogs(),
    getExperiences(),
    getVolunteer(),
    getCertifications(),
  ])

  console.log(
    `[Sitemap] Generated with ${projects.length} projects, ${blogs.length} blogs, ${experiences.length} experiences`
  )

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/volunteer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/certifications`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/read`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // Add individual project pages
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.inline?.id || project.inline.id}`,
    lastModified: project.inline?.updated_at ? new Date(project.inline.updated_at) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Add individual blog post pages
  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${baseUrl}/blog/read/${blog.id}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Add individual experience pages
  const experienceRoutes: MetadataRoute.Sitemap = experiences.map((exp: any) => ({
    url: `${baseUrl}/experiences/${exp.id}`,
    lastModified: exp.updatedAt ? new Date(exp.updatedAt) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Add individual volunteer pages
  const volunteerRoutes: MetadataRoute.Sitemap = volunteer.map((vol: any) => ({
    url: `${baseUrl}/volunteer/${vol.id}`,
    lastModified: vol.updatedAt ? new Date(vol.updatedAt) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  // Add individual certification pages
  const certificationRoutes: MetadataRoute.Sitemap = certifications.map((cert: any) => ({
    url: `${baseUrl}/certifications/${cert.id}`,
    lastModified: cert.updatedAt ? new Date(cert.updatedAt) : currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...blogRoutes,
    ...experienceRoutes,
    ...volunteerRoutes,
    ...certificationRoutes,
  ]
}
