'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { GitHubProject, LinkedInProfile } from '@/data/static_link'
import { Mail, Github, Linkedin } from 'lucide-react'
import { memo } from 'react'

/**
 * Optimized Hero Section
 * - Priority image loading with fetchpriority="high"
 * - Mobile-first responsive images
 * - Reduced layout shift with aspect-ratio
 * - Minimized JavaScript for faster interaction
 */
const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-8 sm:py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image - Critical for LCP, optimized for mobile */}
          <div className="relative flex justify-center lg:justify-start order-1 lg:order-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] aspect-square">
              <div className="absolute -inset-2 bg-linear-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl opacity-40 sm:blur-lg"></div>
              <div className="relative bg-linear-to-br from-card to-card/80 p-3 rounded-2xl shadow-xl border border-border/50">
                <Image
                  src="/Professional.avif"
                  alt="Shardendu Mishra - Software Engineer"
                  width={500}
                  height={500}
                  priority
                  fetchPriority="high"
                  className="rounded-xl object-cover w-full h-full"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px"
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABBEFEiExQVFhkf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEQMhkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>
            </div>
          </div>

          {/* Content - Optimized text rendering */}
          <div className="text-center lg:text-left space-y-6 order-2 lg:order-0">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                  Shardendu Mishra
                </span>
              </h1>
              <div className="w-16 h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
            </div>

            <div className="space-y-3">
              <p className="text-lg lg:text-xl text-foreground">
                Software Engineer passionate about building
                <span className="text-primary font-medium"> impactful applications </span>
                with modern technologies.
              </p>
              <p className="text-base lg:text-lg text-foreground/90">
                Specializing in
                <span className="text-secondary font-medium"> Go, NextJS, SvelteKit </span>
                and
                <span className="text-accent font-medium"> cloud-native solutions</span>.
              </p>
            </div>

            <Link
              href="mailto:mishrashardendu22@gmail.com"
              className="inline-flex items-center gap-2 bg-card/80 rounded-full px-4 py-2 border border-border/50 hover:border-primary/50 transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">mishrashardendu22@gmail.com</span>
            </Link>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href={GitHubProject} className="flex-1" prefetch={false}>
                <Button className="w-full bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 h-12 font-medium">
                  <Github className="mr-2 h-5 w-5" />
                  Check Out my GitHub Projects
                </Button>
              </Link>

              <Link href={LinkedInProfile} className="flex-1" prefetch={false}>
                <Button
                  variant="outline"
                  className="w-full border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 h-12 font-medium"
                >
                  <Linkedin className="mr-2 h-5 w-5" />
                  Super Active on LinkedIn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

export default HeroSection
