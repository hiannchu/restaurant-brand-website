<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import type { Lang } from '../i18n'

const emit = defineEmits<{
  (e: 'choose', lang: Lang): void
}>()

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.fromTo(containerRef.value, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' })
})

function choose(lang: Lang) {
  gsap.to(containerRef.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    onComplete: () => emit('choose', lang),
  })
}
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center gap-12"
  >
    <!-- Brand -->
    <div class="text-center">
      <div
        style="font-family: 'Poiret One', sans-serif;"
        class="text-5xl md:text-7xl text-white tracking-tight mb-3"
      >
        Hakka Lab
      </div>
      <div class="text-neutral-600 text-sm tracking-[0.25em]">客味實驗室</div>
    </div>



    <!-- Language prompt -->
    <div class="flex flex-col items-center gap-8">
      <div class="flex items-center gap-5">
        <button
          @click="choose('zh')"
          class="px-10 py-4 border border-neutral-700 text-white text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-amber-500  hover:shadow-lg hover:-translate-y-0.5"
        >
          中文
        </button>
        <button
          @click="choose('en')"
          class="px-10 py-4 border border-neutral-700 text-white text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-amber-500  hover:shadow-lg hover:-translate-y-0.5"
        >
          English
        </button>
      </div>
    </div>
  </div>
</template>
