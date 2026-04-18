<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits<{ (e: 'done'): void }>()

const wrapRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGSVGElement | null>(null)

onMounted(() => {
  // Continuous spin
  gsap.to(svgRef.value, {
    rotation: 360,
    duration: 10,
    repeat: -1,
    ease: 'none',
    transformOrigin: '50% 50%',
  })

  // Fade in → hold → fade out → done
  gsap.timeline({ onComplete: () => emit('done') })
    .fromTo(wrapRef.value, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' })
    .to(wrapRef.value, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=1.2')
})
</script>

<template>
  <div
    ref="wrapRef"
    class="fixed inset-0 z-[300] bg-black flex items-center justify-center"
  >
    <div class="relative w-52 h-52 md:w-64 md:h-64">
      <!-- Spinning circle with text on edge -->
      <svg ref="svgRef" viewBox="0 0 200 200" class="w-full h-full" aria-hidden="true">
        <defs>
          <path
            id="edgePath"
            d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
          />
        </defs>
        <!-- Circle outline -->
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="0.75" />
        <!-- "Hakka Lab" repeated around the edge -->
        <text
          font-family="'Poiret One', sans-serif"
          font-size="10"
          fill="white"
          opacity="0.85"
          letter-spacing="3"
        >
          <textPath href="#edgePath">
            Hakka Lab · Hakka Lab · Hakka Lab · Hakka Lab · Hakka Lab · Hakka Lab ·&nbsp;
          </textPath>
        </text>
      </svg>

      <!-- Center mark -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-1 h-1 rounded-full bg-white/30" />
      </div>
    </div>
  </div>
</template>
