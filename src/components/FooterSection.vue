<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'

const currentYear = new Date().getFullYear()

const { lang, t } = useLang()

const navGroups = computed(() => {
  const f = translations[lang.value].footer
  return [
    { links: f.navLinks[0] },
    { links: f.navLinks[1] },
    {
      links: f.info.map((label: string) => ({ label, href: '' })),
      noLink: true,
    },
  ]
})

const socials = [
  {
    label: 'Instagram',
    href: '',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>`,
  },
  {
    label: 'Facebook',
    href: '',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  },
  {
    label: 'X (Twitter)',
    href: '',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
]
</script>

<template>
  <footer id="contact" class="bg-neutral-950 text-white">
    <!-- Main footer body -->
    <div class="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <!-- Brand column -->
      <div class="lg:col-span-1">
        <div class="mb-6">
          <span style="font-family: 'Poiret One', sans-serif;">Hakka Lab</span>
        </div>

        <!-- Social links -->
        <div class="flex gap-4">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            :aria-label="s.label"
            class="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-amber-500 hover:text-amber-500 transition-colors duration-300"
            v-html="s.svg"
          />
        </div>
      </div>

      <!-- Nav groups -->
      <div
        v-for="(group, gi) in navGroups"
        :key="gi"
        class="lg:col-span-1"
      >
        <ul class="space-y-3">
          <li v-for="link in group.links" :key="link.label">
            <span v-if="group.noLink" class="text-sm text-neutral-400">{{ link.label }}</span>
            <a v-else :href="link.href" class="text-sm text-neutral-400 hover:text-white transition-colors duration-300">{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-neutral-800">
      <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
        <p>© {{ currentYear }} {{ t('footer.copyright') }}. All rights reserved.</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-neutral-400 transition-colors">{{ t('footer.privacy') }}</a>
          <a href="#" class="hover:text-neutral-400 transition-colors">{{ t('footer.terms') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>
