import { HeroSection } from "@/components/home/HeroSection"
import { RoleSelector } from "@/components/home/RoleSelector"
import { FeaturedModules } from "@/components/home/FeaturedModules"
import { ValueProposition } from "@/components/home/ValueProposition"

export default function Home() {
  return (
    <>
      <HeroSection />
      <RoleSelector />
      <FeaturedModules />
      <ValueProposition />
    </>
  )
}
