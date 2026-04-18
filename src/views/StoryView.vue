<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'
import { computed } from 'vue'

const { lang } = useLang()
const sv = computed(() => translations[lang.value].storyView)
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <NavBar />

    <main class="h-[90vh] flex flex-col lg:flex-row lg:items-stretch">

      <!-- Left column: 3/4 width, image flush to left edge -->
      <div class="w-full lg:w-3/4 h-64 lg:h-full shrink-0">
        <img
          src="/images/story.webp"
          alt="背後故事"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Right column: 1/4 width, text at bottom -->
      <div class="w-full lg:w-1/4 px-8 md:px-10 pt-12 pb-10 flex flex-col justify-end">

        <div class="flex flex-col gap-6 text-neutral-400 text-sm leading-relaxed">
          <p>
            <span style="font-family: 'Poiret One', sans-serif;" class="text-white">Hakka Lab</span>
            {{ sv.p1 }}
          </p>
          <p>
            {{ sv.p2before }}<span style="font-family: 'Poiret One', sans-serif;" class="text-white">Hakka Lab</span>{{ sv.p2after }}
          </p>
        </div>

      </div>

    </main>

    <FooterSection />
  </div>
</template>
