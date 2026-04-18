<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'

gsap.registerPlugin(ScrollTrigger)

const { lang } = useLang()

const sectionRef = ref<HTMLElement | null>(null)
const leftStripRef = ref<HTMLElement | null>(null)
const rightStripRef = ref<HTMLElement | null>(null)

const rowImages = [
  { leftImg: '/images/home-row-1-left.webp', rightImg: '/images/home-row-1-right.webp' },
  { leftImg: '/images/home-row-2-left.webp', rightImg: '/images/home-row-2-right.webp' },
  { leftImg: '/images/home-row-3-left.webp', rightImg: '/images/home-row-3-right.webp' },
]

const items = computed(() =>
  translations[lang.value].threeCol.map((col, i) => ({
    title: col.title,
    description: col.desc,
    ...rowImages[i],
  }))
)

let ctx: ReturnType<typeof gsap.context> | null = null

onMounted(() => {
  const section = sectionRef.value
  const leftStrip = leftStripRef.value
  const rightStrip = rightStripRef.value
  if (!section || !leftStrip || !rightStrip) return

  const rowH = window.innerHeight
  section.style.height = rowH + 'px'
  const totalTranslate = rowH * 2

  ctx = gsap.context(() => {
    const textEls = section.querySelectorAll('.center-text')
    gsap.set([textEls[1], textEls[2]], { opacity: 0, y: 30 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        end: `+=${window.innerHeight * 3}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    })

    tl.to([leftStrip, rightStrip], { y: -totalTranslate, ease: 'none', duration: 4 }, 0)

    tl.to(textEls[0], { opacity: 0, y: -30, duration: 0.4 }, 0.8)
    tl.to(textEls[1], { opacity: 1, y: 0,   duration: 0.4 }, 0.8)

    tl.to(textEls[1], { opacity: 0, y: -30, duration: 0.4 }, 2.8)
    tl.to(textEls[2], { opacity: 1, y: 0,   duration: 0.4 }, 2.8)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="value"
    ref="sectionRef"
    class="flex overflow-hidden bg-black"
  >
    <!-- Left image column -->
    <div class="flex-1 h-full overflow-hidden">
      <div ref="leftStripRef" class="flex flex-col gap-2 will-change-transform">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="shrink-0 h-screen w-full overflow-hidden"
        >
          <img :src="item.leftImg" :alt="item.title" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- Center text column -->
    <div class="flex-1 h-full relative flex items-center justify-center">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="center-text absolute inset-x-0 px-10 text-left md:text-center"
      >
        <h3 class="text-xl lg:text-3xl font-bold text-white leading-snug mb-5">
          {{ item.title }}
        </h3>
        <div class="w-8 h-px bg-amber-500 ml-0 mr-auto md:mx-auto mb-5" />
        <p class="text-neutral-400 text-sm leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>

    <!-- Right image column -->
    <div class="hidden md:block flex-1 h-full overflow-hidden">
      <div ref="rightStripRef" class="flex flex-col gap-2 will-change-transform">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="shrink-0 h-screen w-full overflow-hidden"
        >
          <img :src="item.rightImg" :alt="item.title" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </section>
</template>
