'use client'

import { showToast } from '@/lib/toast'
import { useEffect, useState } from 'react'
import Error from '@/components/extra/Error'
import SkillsSection from '@/components/main/skill'
import { skillsAPI } from '@/util/apiResponse.util'
import { SkillsSkeleton } from '@/components/main/loading'

export function SkillsDataLoader() {
  const [skills, setSkills] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsRes = await skillsAPI.getSkills()
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setLoading(false)
        showToast.success('Skills loaded!')
      } catch (err) {
        setError('Failed to load skills')
        showToast.error('Failed to load skills')
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  if (error) {
    return (
      <Error
        error={error}
        onRetry={() => window.location.reload()}
        showActions={true}
        title="Failed to load skills"
      />
    )
  }

  return loading ? <SkillsSkeleton /> : <SkillsSection skills={skills} />
}
