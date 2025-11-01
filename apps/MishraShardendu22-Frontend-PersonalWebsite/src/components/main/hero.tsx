'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { GitHubProject, LinkedInProfile } from '@/data/static_link'
import { Mail, ArrowRight, Code, Coffee, LinkedinIcon, Github } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-8 sm:py-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image container with fixed aspect ratio to prevent CLS */}
          <div className="relative flex justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] aspect-square">
              {/* Reduced blur and animations on mobile */}
              <div className="absolute -inset-1.5 sm:-inset-2 bg-linear-to-r from-primary/10 via-secondary/10 to-accent/10 sm:from-primary/20 sm:via-secondary/20 sm:to-accent/20 rounded-xl sm:rounded-2xl sm:blur-lg opacity-40 will-change-auto"></div>

              <div className="relative bg-linear-to-br from-card to-card/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-border/50 will-change-auto aspect-square">
                <Image
                  src="/Professional.webp"
                  alt="Shardendu Mishra - Software Engineer"
                  width={500}
                  height={500}
                  priority
                  fetchPriority="high"
                  className="rounded-lg sm:rounded-xl object-cover w-full h-full"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px"
                  loading="eager"
                  quality={90}
                />
              </div>

              {/* Static badges on mobile, animated on desktop */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-primary/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2.5 border border-primary/30 shadow-lg">
                <Code
                  className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-secondary/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2.5 border border-secondary/30 shadow-lg">
                <Coffee
                  className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left order-2 lg:order-2">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-linear-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent block">
                    Shardendu
                  </span>
                  <span className="text-foreground block">Mishra</span>
                </h1>

                <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-linear-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
              </div>

              <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground max-w-sm sm:max-w-lg mx-auto lg:mx-0">
                  Software Engineer passionate about building
                  <span className="text-primary font-medium"> impactful applications </span>
                  with modern technologies.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-foreground/90 max-w-sm sm:max-w-lg mx-auto lg:mx-0">
                  Specializing in
                  <span className="text-secondary font-medium"> Go, NextJS, </span>
                  and
                  <span className="text-accent font-medium"> cloud-native solutions</span>.
                </p>
              </div>

              <div className="flex items-center justify-center lg:justify-start px-4 sm:px-0">
                <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-border/50 max-w-full overflow-hidden">
                  <Mail
                    className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0"
                    aria-hidden="true"
                  />
                  <Link
                    href="mailto:mishrashardendu22@gmail.com"
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium text-xs sm:text-sm lg:text-base truncate"
                  >
                    mishrashardendu22@gmail.com
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 px-4 sm:px-0">
                <Link href={GitHubProject} className="w-full sm:w-auto" prefetch={false}>
                  <Button
                    size="lg"
                    className="group bg-linear-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg transition-all duration-200 w-full sm:w-auto touch-manipulation min-h-11"
                  >
                    <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden="true" />
                    <span className="text-sm sm:text-base truncate hidden sm:inline">
                      GitHub - Check Out My Projects
                    </span>
                    <span className="text-sm truncate sm:hidden block w-full mt-1">
                      View GitHub Projects
                    </span>
                    <ArrowRight
                      className="ml-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link href={LinkedInProfile} className="w-full sm:w-auto" prefetch={false}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-2 border-primary/30 hover:border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/5 text-foreground hover:text-primary transition-all duration-200 shadow-lg w-full sm:w-auto touch-manipulation min-h-11"
                  >
                    <LinkedinIcon
                      className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm sm:text-base truncate hidden sm:inline">
                      Super Active on LinkedIn - Let&apos;s Connect
                    </span>
                    <span className="text-sm truncate sm:hidden">Connect on LinkedIn</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Static scroll indicator on mobile */}
        <div className="flex justify-center mt-8 sm:hidden" aria-hidden="true">
          <ArrowRight className="h-4 w-4 text-primary/60 rotate-90" />
        </div>
      </div>
    </section>
  )
}
