'use client'

import { useEffect, useState } from 'react'
import { getCachedStats } from '@/lib/cache'
import { DashboardData } from '@/data/types.data'
import { GitHubProfileCard } from '../chart/github'
import { TopRepositoriesCard } from '../chart/repo'
import { LoadingScreen } from '../chart/loader-chart'
import { DashboardHeader } from '../chart/dash-heaed'
import { EnhancedCommitsChart } from '../chart/commit'
import { LeetCodeStatsCard } from '../chart/leet-card'

export default function ModernDeveloperDashboard() {
  const [data, setData] = useState<DashboardData>({})
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const cachedLocal = localStorage.getItem('profile_stats')
    if (cachedLocal) {
      const parsed = JSON.parse(cachedLocal)
      setData(parsed)
      setLoading(false)
    }

    getCachedStats().then((fresh) => {
      if (fresh) {
        localStorage.setItem('profile_stats', JSON.stringify(fresh))
        setData(fresh)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.github && <GitHubProfileCard github={data.github} stars={data.stars || 0} />}

          {data.leetcode?.profile && data.leetcode?.submitStats && (
            <LeetCodeStatsCard leetcode={data.leetcode} />
          )}

          {!isMobile && data.commits && data.commits.length > 0 && (
            <EnhancedCommitsChart commits={data.commits} />
          )}

          {data.topRepos && data.topRepos.length > 0 && (
            <TopRepositoriesCard topRepos={data.topRepos} />
          )}
        </div>
      </div>
    </div>
  )
}
