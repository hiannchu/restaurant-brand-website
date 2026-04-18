<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '@/composables/useLang'

gsap.registerPlugin(ScrollTrigger)

const { t } = useLang()

const sectionRef   = ref<HTMLElement | null>(null)
const textRef      = ref<HTMLElement | null>(null)
const row2Ref      = ref<HTMLElement | null>(null)
const img2aRef     = ref<HTMLElement | null>(null)
const img2bRef     = ref<HTMLElement | null>(null)

let ctx: ReturnType<typeof gsap.context> | null = null

onMounted(() => {
  if (!sectionRef.value) return

  ctx = gsap.context(() => {
    // Row 1: per-line text reveal
    if (textRef.value) {
      const lines = textRef.value.querySelectorAll<HTMLElement>('.line-reveal')
      gsap.set(lines, { y: '100%' })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: textRef.value,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true,
        },
      })
      lines.forEach((line, i) => {
        tl.fromTo(line, { y: '100%' }, { y: '0%', ease: 'none', duration: 0.5 }, i * 0.2)
      })
    }

    // Row 2 photos: slide up from bottom of clip
    if (row2Ref.value) {
      gsap.set([img2aRef.value, img2bRef.value], { y: '100%' })
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: row2Ref.value,
          start: 'top 90%',
          end: 'top 70%',
          scrub: true,
        },
      })
      tl2
        .to(img2aRef.value, { y: '0%', ease: 'none', duration: 1 }, 0)
        .to(img2bRef.value, { y: '0%', ease: 'none', duration: 1 }, 0.15)
    }
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="story"
    ref="sectionRef"
    class="bg-black h-screen flex flex-col py-12 md:py-16 overflow-hidden"
  >

    <!-- Row 1: text, right-aligned -->
    <div class="flex justify-end px-6 md:px-16 pt-24">
      <div ref="textRef" class="max-w-2xl text-right">
        <p class="overflow-hidden m-0">
          <span class="line-reveal block text-white text-xs md:text-base leading-relaxed">
            <span style="font-family: 'Poiret One', sans-serif;">Hakka Lab</span>{{ t('story.line1') }}
          </span>
        </p>
        <p class="overflow-hidden m-0">
          <span class="line-reveal block text-white text-xs md:text-base leading-relaxed">{{ t('story.line2') }}</span>
        </p>
        <p class="overflow-hidden m-0">
          <span class="line-reveal block text-white text-xs md:text-base leading-relaxed">{{ t('story.line3') }}</span>
        </p>
        <p class="overflow-hidden m-0">
          <span class="line-reveal block text-white text-xs md:text-base leading-relaxed">{{ t('story.line4') }}</span>
        </p>
        <p class="overflow-hidden m-0">
          <span class="line-reveal block text-white text-xs md:text-base leading-relaxed">{{ t('story.line5') }}</span>
        </p>
      </div>
    </div>

    <!-- Row 2: two photos, left-aligned -->
    <div ref="row2Ref" class="flex gap-3 md:gap-4 px-6 md:px-16 mt-8 md:mt-12">
      <div class="overflow-hidden aspect-square w-[45%] md:w-72 lg:w-80 shrink-0">
        <img ref="img2aRef" src="/images/home-story-1.webp" alt="" class="w-full h-full object-cover" />
      </div>
      <div class="overflow-hidden aspect-square w-[45%] md:w-72 lg:w-80 shrink-0">
        <img ref="img2bRef" src="/images/home-story-2.webp" alt="" class="w-full h-full object-cover" />
      </div>
    </div>

  </section>
</template>
