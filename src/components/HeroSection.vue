<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

const { lang } = useLang()

const heroRef = ref<HTMLElement | null>(null)
const heroBgRef = ref<HTMLElement | null>(null)
const col1Ref = ref<HTMLElement | null>(null)
const col2Ref = ref<HTMLElement | null>(null)
const col3Ref = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)

const isEn = computed(() => lang.value === 'en')
const heroCol1 = computed(() => translations[lang.value].hero.col1 as readonly string[])
const heroCol2 = computed(() => translations[lang.value].hero.col2 as readonly string[])
const heroCol3 = computed(() => translations[lang.value].hero.col3 as readonly string[])

let ctx: ReturnType<typeof gsap.context> | null = null

// Persists across lang-switch re-mounts so entrance only plays once per page load
let hasEntered = false

onMounted(() => {
  if (heroRef.value) heroRef.value.style.height = window.innerHeight + 'px'

  ctx = gsap.context(() => {
    if (!hasEntered) {
      hasEntered = true

      gsap.set([heroBgRef.value, col1Ref.value, col2Ref.value, col3Ref.value], { opacity: 0 })
      gsap.set([col1Ref.value, col2Ref.value, col3Ref.value], { y: 30 })

      gsap.timeline()
        .to(heroBgRef.value, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .to(col1Ref.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.5)
        .to(col2Ref.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.65)
        .to(col3Ref.value, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
    } else {
      gsap.set([col1Ref.value, col2Ref.value, col3Ref.value], { x: 0, opacity: 1, y: 0 })
    }

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: '+=2000',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    scrollTl
      .to(col1Ref.value, { x: '-130vw', ease: 'power2.in' }, 0)
      .to(col2Ref.value, { x: '-130vw', ease: 'power2.in' }, 0.12)
      .to(col3Ref.value, { x: '-130vw', ease: 'power2.in' }, 0.24)
      .fromTo(overlayRef.value, { opacity: 1 }, { opacity: 0, ease: 'none' }, 0)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    ref="heroRef"
    id="hero"
    class="relative min-h-150 flex items-end overflow-hidden bg-black"
  >
    <!-- Background image -->
    <div
      ref="heroBgRef"
      class="hero-bg absolute inset-0 -top-20 bg-cover bg-center"
      style="background-image: url('/images/hero-section.webp'); background-position: center 50%; -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%); mask-image: linear-gradient(to bottom, black 70%, transparent 100%);"
    />

    <!-- Dark overlay — fades out during scroll -->
    <div ref="overlayRef" class="absolute inset-0 bg-black/70" />

    <!-- ZH: three side-by-side columns of stacked characters -->
    <div v-if="!isEn" class="relative z-10 flex gap-4 md:gap-6 pl-6 md:pl-10 pb-10 md:pb-16">
      <div ref="col1Ref" class="flex flex-col hero-col">
        <span v-for="(char, i) in heroCol1" :key="i" class="font-bold text-white leading-none">{{ char }}</span>
      </div>
      <div ref="col2Ref" class="flex flex-col hero-col">
        <span v-for="(char, i) in heroCol2" :key="i" class="font-bold text-white leading-none">{{ char }}</span>
      </div>
      <div ref="col3Ref" class="flex flex-col hero-col">
        <span v-for="(char, i) in heroCol3" :key="i" class="font-bold text-white leading-none">{{ char }}</span>
      </div>
    </div>

    <!-- EN: three words stacked horizontally, left-aligned -->
    <div v-else class="relative z-10 flex flex-col pl-6 md:pl-10 pb-10 md:pb-16">
      <div ref="col1Ref" class="hero-word text-white leading-none" style="font-family: 'Poiret One', sans-serif;">{{ heroCol1.join('') }}</div>
      <div ref="col2Ref" class="hero-word text-white leading-none" style="font-family: 'Poiret One', sans-serif;">{{ heroCol2.join('') }}</div>
      <div ref="col3Ref" class="hero-word text-white leading-none" style="font-family: 'Poiret One', sans-serif;">{{ heroCol3.join('') }}</div>
    </div>
  </section>
</template>

<style scoped>
/* ZH: per-column character size */
.hero-col {
  font-size: 16vw;
  line-height: 0.95;
}

@media (min-width: 1024px) {
  .hero-col {
    font-size: 8vw;
  }
}

/* EN: full-word horizontal lines */
.hero-word {
  font-size: 18vw;
  line-height: 0.9;
  letter-spacing: -0.02em;
}

@media (min-width: 1024px) {
  .hero-word {
    font-size: 14vw;
  }
}
</style>
