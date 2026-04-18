<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import HeroSection from '@/components/HeroSection.vue'
import ThreeColumnSection from '@/components/ThreeColumnSection.vue'
import StorySection from '@/components/StorySection.vue'
import CtaSection from '@/components/CtaSection.vue'
import FooterSection from '@/components/FooterSection.vue'
import { useLang } from '@/composables/useLang'

const { lang } = useLang()
</script>

<template>
  <NavBar />
  <main>
    <!-- :key causes GSAP-animated components to remount on lang change,
         which re-runs onMounted and resets all scroll animations cleanly -->
    <HeroSection :key="'hero-' + lang" />
    <StorySection :key="'story-' + lang" />
    <ThreeColumnSection :key="'three-' + lang" />
    <CtaSection />
  </main>
  <FooterSection />
</template>
