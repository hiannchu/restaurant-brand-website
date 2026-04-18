<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { supabase, type Reservation } from '@/lib/supabase'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'

const route = useRoute()
const router = useRouter()
const { lang } = useLang()

const s = computed(() => translations[lang.value].reservationSuccess)

const reservationCode = (route.query.code as string) || ''
const reservation = ref<Reservation | null>(null)

onMounted(async () => {
  if (!reservationCode) return
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .eq('reservation_code', reservationCode)
    .single()
  reservation.value = data
})

const copied = ref(false)

async function copyCode() {
  await navigator.clipboard.writeText(reservationCode)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(s.value.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col">
    <NavBar />

    <div class="flex-1 flex items-center justify-center px-6 py-32">
      <div class="max-w-md w-full text-center">

        <!-- Icon -->
        <div class="w-16 h-16 rounded-full border border-amber-500 flex items-center justify-center mx-auto mb-8">
          <svg class="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-2xl md:text-3xl font-bold mb-4">{{ s.title }}</h1>
        <p class="text-neutral-400 text-sm leading-relaxed mb-10">
          {{ s.subtitle }}<br class="hidden md:block"/>
          {{ s.subtitle2 }}
        </p>

        <!-- Reservation Code -->
        <div class="bg-neutral-900 border border-neutral-800 rounded-xl px-8 py-6 mb-8 w-full">
          <p class="text-xs uppercase tracking-widest text-neutral-500 mb-2">{{ s.codeLabel }}</p>
          <div class="flex items-center justify-center gap-3">
            <p class="text-3xl font-mono font-bold text-amber-400 tracking-widest">{{ reservationCode }}</p>
            <button
              @click="copyCode"
              class="text-neutral-500 hover:text-white transition-colors duration-200"
              :aria-label="copied ? 'Copied' : 'Copy code'"
            >
              <!-- Copy icon -->
              <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <!-- Check icon -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Summary -->
        <div v-if="reservation" class="text-sm text-neutral-400 mb-10 space-y-1">
          <p>{{ reservation.customer_name }} &nbsp;·&nbsp; {{ formatDate(reservation.date) }} &nbsp;·&nbsp; {{ reservation.time }} &nbsp;·&nbsp; {{ reservation.party_size }} {{ s.unitPeople }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            class="px-8 py-3 border border-neutral-700 hover:border-neutral-500 text-white text-sm uppercase tracking-widest rounded-full transition-colors"
          >
            {{ s.backHome }}
          </a>
          <button
            @click="router.push({ name: 'reservation', hash: '#lookup' })"
            class="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {{ s.lookupBtn }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>
