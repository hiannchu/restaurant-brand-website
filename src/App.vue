<script setup lang="ts">
import { ref } from 'vue'
import { useLang } from './composables/useLang'
import LoadingScreen from './components/LoadingScreen.vue'
import LangSplash from './components/LangSplash.vue'
import type { Lang } from './i18n'

const { setLang } = useLang()
const showLoading = ref(true)
const showSplash = ref(false)

function onLoadingDone() {
  showLoading.value = false
  showSplash.value = !localStorage.getItem('lang')
}

function handleLangChoice(lang: Lang) {
  setLang(lang)
  showSplash.value = false
}
</script>

<template>
  <LoadingScreen v-if="showLoading" @done="onLoadingDone" />
  <LangSplash v-else-if="showSplash" @choose="handleLangChoice" />
  <RouterView v-else />
</template>
