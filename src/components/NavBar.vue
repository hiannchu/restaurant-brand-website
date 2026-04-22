<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import { useLang } from '@/composables/useLang'

const route = useRoute()
const isHomePage = computed(() => route.path === '/')
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const { lang, setLang, t } = useLang()

const navLinks = computed(() => [
  { label: t('nav.menu'), href: '/menu' },
  { label: t('nav.story'), href: '/story' },
])

function handleScroll() {
  isScrolled.value = window.scrollY > 860
}

function handleClickOutside(e: MouseEvent) {
  if (isMobileMenuOpen.value && headerRef.value && !headerRef.value.contains(e.target as Node)) {
    isMobileMenuOpen.value = false
  }
}

watch(isScrolled, (scrolled) => {
  if (!headerRef.value || !isHomePage.value) return
  if (window.innerWidth < 768) {
    gsap.set(headerRef.value, { clearProps: 'all' })
    return
  }

  if (scrolled) {
    gsap.to(headerRef.value, {
      top: '24px',
      left: '48px',
      right: '48px',
      borderRadius: '80px',
      padding: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.10)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      duration: 0.5,
      ease: 'power3.out',
    })
  } else {
    gsap.to(headerRef.value, {
      top: '0px',
      left: '0px',
      right: '0px',
      borderRadius: '0px',
      paddingTop: '24px',
      paddingBottom: '24px',
      backgroundColor: 'rgba(255, 255, 255, 0)',
      boxShadow: 'none',
      backdropFilter: 'blur(0px)',
      WebkitBackdropFilter: 'blur(0px)',
      duration: 0.5,
      ease: 'power3.out',
    })
  }
})

let navHasEntered = false

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleClickOutside)
  if (window.innerWidth >= 768 && headerRef.value) {
    if (isHomePage.value) {
      gsap.set(headerRef.value, { paddingTop: '24px', paddingBottom: '24px' })
    } else {
      gsap.set(headerRef.value, { paddingTop: '24px', paddingBottom: '24px', backgroundColor: 'rgba(0,0,0,1)' })
    }
  }
  if (!navHasEntered && headerRef.value) {
    navHasEntered = true
    gsap.from(headerRef.value, { opacity: 0, y: -24, duration: 0.9, delay: 0.2, ease: 'power3.out' })
  }
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-50"
  >
    <nav class="w-full px-6 py-2 flex items-center justify-between bg-black" :class="{ 'md:bg-transparent': isHomePage }">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2">
        <span
          class="text-2xl tracking-tight text-white"
          style="font-family: 'Poiret One', sans-serif;"
        >
          Hakka Lab
        </span>
      </a>

      <!-- Desktop nav links -->
      <ul class="hidden md:flex items-center gap-10">
        <li v-for="link in navLinks" :key="link.label">
          <a
            :href="link.href"
            class="nav-underline text-sm font-medium uppercase tracking-widest text-white transition-colors duration-500 hover:text-amber-500"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- Desktop right: CTA + lang switcher -->
      <div class="hidden md:flex items-center gap-6">
        <!-- Language switcher -->
        <div class="flex items-center gap-1 text-xs tracking-widest">
          <button
            @click="setLang('zh')"
            :class="lang === 'zh' ? 'text-amber-500' : 'text-neutral-500 hover:text-white'"
            class="transition-colors duration-300"
          >ZH</button>
          <span class="text-neutral-700">/</span>
          <button
            @click="setLang('en')"
            :class="lang === 'en' ? 'text-amber-500' : 'text-neutral-500 hover:text-white'"
            class="transition-colors duration-300"
          >EN</button>
        </div>

        <!-- CTA -->
        <a
          href="/reservation"
          class="nav-underline text-sm font-medium uppercase tracking-widest text-white/90 transition-colors duration-500 hover:text-amber-500"
        >
          {{ t('nav.reservation') }}
        </a>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        aria-label="Toggle menu"
      >
        <span
          v-for="i in 3"
          :key="i"
          :class="['block w-6 h-0.5 bg-white', i !== 3 ? 'mb-1.5' : '']"
        />
      </button>
    </nav>

    <!-- Mobile overlay -->
    <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden fixed inset-0 bg-black/60 z-[-1]"
        @click="isMobileMenuOpen = false"
      />
    </transition>

    <!-- Mobile menu -->
    <transition
      enter-active-class="transition-all duration-400 ease-out"
      enter-from-class="opacity-0 -translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-black px-6 py-6"
      >
        <ul class="flex flex-col gap-4">
          <li v-for="link in navLinks" :key="link.label">
            <a
              :href="link.href"
              class="text-white text-sm font-medium uppercase tracking-widest hover:text-amber-600 transition-colors"
              @click="isMobileMenuOpen = false"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- Mobile lang switcher -->
        <div class="flex items-center gap-3 mt-6 text-xs tracking-widest">
          <button
            @click="setLang('zh'); isMobileMenuOpen = false"
            :class="lang === 'zh' ? 'text-amber-500' : 'text-neutral-500'"
            class="uppercase"
          >ZH</button>
          <span class="text-neutral-700">/</span>
          <button
            @click="setLang('en'); isMobileMenuOpen = false"
            :class="lang === 'en' ? 'text-amber-500' : 'text-neutral-500'"
            class="uppercase"
          >EN</button>
        </div>

        <a
          href="/reservation"
          class="mt-16 inline-flex text-white text-sm font-semibold uppercase tracking-widest"
          @click="isMobileMenuOpen = false"
        >
          {{ t('nav.reservation') }}
        </a>
      </div>
    </transition>
  </header>
</template>
