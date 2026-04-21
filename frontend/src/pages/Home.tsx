import { HeroSection } from "@/components/home/HeroSection"
import { RoleSelector } from "@/components/home/RoleSelector"
import { LearningJourney } from "@/components/home/LearningJourney"
import { FeaturedModules } from "@/components/home/FeaturedModules"
import { ValueProposition } from "@/components/home/ValueProposition"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValueProposition />
      <RoleSelector />
      <FeaturedModules />
      <LearningJourney />
    </>
  )
}
