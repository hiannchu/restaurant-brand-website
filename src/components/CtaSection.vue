<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useLang } from '@/composables/useLang'

const { t } = useLang()

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null

onMounted(() => {
  gsap.set(contentRef.value, { opacity: 0, y: 30 })

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(contentRef.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        observer?.disconnect()
      }
    },
    { threshold: 0.8 },
  )

  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    style="background-image: linear-gradient(to top, transparent 0%, black 95%), url('/images/home-cta-section.webp'); background-size: cover; background-position: center 70%;"
  >
    <div ref="contentRef" class="text-center">
      <h2 class="text-xl md:text-4xl font-bold text-white mb-16">
        {{ t('cta.heading') }}
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-4 justify-center">
        <a
          href="/reservation"
          class="inline-flex items-center gap-2 px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {{ t('cta.reservation') }}
        </a>
        <a
          href="#contact"
          class="inline-flex items-center gap-2 px-10 py-4 bg-amber-600 hover:bg-amber-500 text-white uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          {{ t('cta.info') }}
        </a>
      </div>
    </div>
  </section>
</template>
