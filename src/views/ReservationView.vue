<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import { supabase, type Reservation } from '@/lib/supabase'
import { useLang } from '@/composables/useLang'
import { translations } from '@/i18n'

const router = useRouter()
const { lang } = useLang()
const r = computed(() => translations[lang.value].reservation)

// ── New reservation form ──────────────────────────────────────────────────────

const form = ref({
  name: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  guests: '',
  notes: '',
})
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submitError = ref('')

const timeSlots = [
  '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
]

const today = computed(() => new Date().toISOString().split('T')[0])
const guestsNum = computed(() => Number(form.value.guests))
const showCallMessage = computed(() => guestsNum.value > 10)
const isMonday = computed(() => {
  if (!form.value.date) return false
  return new Date(form.value.date + 'T00:00:00').getDay() === 1
})

function validate(): boolean {
  const rv = r.value
  const e: Record<string, string> = {}
  if (!form.value.name.trim()) e.name = rv.errName
  if (!form.value.phone.trim() && !form.value.email.trim())
    e.contact = rv.errContact
  if (!form.value.date) e.date = rv.errDate
  else if (isMonday.value) e.date = rv.errMonday
  if (!form.value.time) e.time = rv.errTime
  const g = Number(form.value.guests)
  if (!form.value.guests || isNaN(g) || g < 1) e.guests = rv.errGuests
  else if (g > 10) e.guests = rv.errGuestsMax
  errors.value = e
  return Object.keys(e).length === 0
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function submit() {
  if (!validate()) return
  isSubmitting.value = true
  submitError.value = ''

  const reservation_code = generateCode()

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      reservation_code,
      customer_name: form.value.name.trim(),
      phone: form.value.phone.trim() || null,
      email: form.value.email.trim() || null,
      date: form.value.date,
      time: form.value.time,
      party_size: Number(form.value.guests),
      notes: form.value.notes.trim() || null,
    })
    .select('reservation_code')
    .single()

  isSubmitting.value = false

  if (error) {
    submitError.value = r.value.submitError
    console.error(error)
    return
  }

  router.push({ name: 'reservation-success', query: { code: data.reservation_code } })
}

// ── Lookup existing reservation ───────────────────────────────────────────────

const lookupId = ref('')
const lookupResult = ref<Reservation | null>(null)
const lookupError = ref('')
const isLooking = ref(false)

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString(r.value.dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

async function lookup() {
  lookupError.value = ''
  lookupResult.value = null
  isEditing.value = false
  confirmCancel.value = false
  const code = lookupId.value.trim().toUpperCase()
  if (!code) { lookupError.value = r.value.errLookupEmpty; return }

  isLooking.value = true
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('reservation_code', code)
    .single()
  isLooking.value = false

  if (error || !data) {
    lookupError.value = r.value.errLookup
    return
  }

  lookupResult.value = data
}

// ── Edit reservation ──────────────────────────────────────────────────────────

const isEditing = ref(false)
const isSaving = ref(false)
const saveError = ref('')
const editErrors = ref<Record<string, string>>({})
const editForm = ref({ name: '', phone: '', email: '', date: '', time: '', guests: '', notes: '' })

const isEditMonday = computed(() => {
  if (!editForm.value.date) return false
  return new Date(editForm.value.date + 'T00:00:00').getDay() === 1
})

function startEdit() {
  const res = lookupResult.value
  if (!res) return
  editForm.value = {
    name: res.customer_name,
    phone: res.phone ?? '',
    email: res.email ?? '',
    date: res.date,
    time: res.time,
    guests: String(res.party_size),
    notes: res.notes ?? '',
  }
  editErrors.value = {}
  saveError.value = ''
  isEditing.value = true
}

function validateEdit(): boolean {
  const rv = r.value
  const e: Record<string, string> = {}
  if (!editForm.value.name.trim()) e.name = rv.errName
  if (!editForm.value.phone.trim() && !editForm.value.email.trim())
    e.contact = rv.errContact
  if (!editForm.value.date) e.date = rv.errDate
  else if (isEditMonday.value) e.date = rv.errMonday
  if (!editForm.value.time) e.time = rv.errTime
  const g = Number(editForm.value.guests)
  if (!editForm.value.guests || isNaN(g) || g < 1) e.guests = rv.errGuests
  else if (g > 10) e.guests = rv.errGuestsMax
  editErrors.value = e
  return Object.keys(e).length === 0
}

async function saveEdit() {
  if (!validateEdit() || !lookupResult.value) return
  isSaving.value = true
  saveError.value = ''

  const { data, error } = await supabase
    .from('reservations')
    .update({
      customer_name: editForm.value.name.trim(),
      phone: editForm.value.phone.trim() || null,
      email: editForm.value.email.trim() || null,
      date: editForm.value.date,
      time: editForm.value.time,
      party_size: Number(editForm.value.guests),
      notes: editForm.value.notes.trim() || null,
    })
    .eq('id', lookupResult.value.id)
    .select('*')
    .single()

  isSaving.value = false

  if (error || !data) {
    saveError.value = r.value.errSave
    return
  }

  lookupResult.value = data
  isEditing.value = false
}

// ── Cancel reservation ────────────────────────────────────────────────────────

const confirmCancel = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')
const cancelDone = ref(false)

async function cancelReservation() {
  if (!lookupResult.value) return
  isDeleting.value = true
  deleteError.value = ''

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', lookupResult.value.id)

  isDeleting.value = false

  if (error) {
    deleteError.value = r.value.errDelete
    return
  }

  lookupResult.value = null
  confirmCancel.value = false
  cancelDone.value = true
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <NavBar />

    <!-- Page header -->
    <div class="pt-48 pb-12 text-center px-6">
      <h1 class="text-3xl md:text-4xl font-bold">
        {{ r.pageTitle }}
      </h1>
    </div>

    <!-- Two-column layout -->
    <div class="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800">

      <!-- Left column: New reservation form -->
      <div class="bg-black px-8 py-10 md:pr-14">
        <h2 class="text-lg font-semibold text-white mb-8">{{ r.formHeading }}</h2>

        <form @submit.prevent="submit" novalidate class="flex flex-col gap-6">

          <!-- Name -->
          <div>
            <label class="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
              {{ r.name }} <span class="text-amber-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="r.namePlaceholder"
              class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p v-if="errors.name" class="mt-1.5 text-xs text-red-400">{{ errors.name }}</p>
          </div>

          <!-- Phone + Email -->
          <div>
            <label class="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
              {{ r.contact }} <span class="text-amber-500">*</span>
              <span class="text-neutral-600 ml-1 normal-case tracking-normal">{{ r.contactNote }}</span>
            </label>
            <div class="flex flex-col gap-3">
              <input
                v-model="form.phone"
                type="tel"
                :placeholder="r.phonePlaceholder"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <input
                v-model="form.email"
                type="email"
                :placeholder="r.emailPlaceholder"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <p v-if="errors.contact" class="mt-1.5 text-xs text-red-400">{{ errors.contact }}</p>
          </div>

          <!-- Date + Time -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
                {{ r.date }} <span class="text-amber-500">*</span>
              </label>
              <input
                v-model="form.date"
                type="date"
                :min="today"
                :class="[
                  'w-full bg-neutral-900 border rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors',
                  isMonday ? 'border-red-500 focus:border-red-500' : 'border-neutral-700 focus:border-amber-500',
                ]"
              />
              <p v-if="isMonday" class="mt-1.5 text-xs text-red-400">{{ r.errMondayInline }}</p>
              <p v-else-if="errors.date" class="mt-1.5 text-xs text-red-400">{{ errors.date }}</p>
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
                {{ r.time }} <span class="text-amber-500">*</span>
              </label>
              <select
                v-model="form.time"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="" disabled>{{ r.timePlaceholder }}</option>
                <optgroup :label="r.lunch">
                  <option v-for="t in timeSlots.slice(0, 5)" :key="t" :value="t">{{ t }}</option>
                </optgroup>
                <optgroup :label="r.dinner">
                  <option v-for="t in timeSlots.slice(5)" :key="t" :value="t">{{ t }}</option>
                </optgroup>
              </select>
              <p v-if="errors.time" class="mt-1.5 text-xs text-red-400">{{ errors.time }}</p>
            </div>
          </div>

          <!-- Guests -->
          <div>
            <label class="block text-xs uppercase tracking-widest text-neutral-400 mb-2">
              {{ r.guests }} <span class="text-amber-500">*</span>
            </label>
            <input
              v-model="form.guests"
              type="number"
              min="1"
              :placeholder="r.guestsPlaceholder"
              class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <p v-if="errors.guests" class="mt-1.5 text-xs text-red-400">{{ errors.guests }}</p>
            <p v-if="showCallMessage && !errors.guests" class="mt-1.5 text-xs text-amber-500">
              {{ r.largeGroupNote }}
            </p>
            <p v-else-if="!errors.guests" class="mt-1.5 text-xs text-neutral-600">
              {{ r.largeGroupHint }}
            </p>
          </div>

          <!-- Note -->
          <div>
            <label class="block text-xs uppercase tracking-widest text-neutral-400 mb-2">{{ r.notes }}</label>
            <textarea
              v-model="form.notes"
              rows="3"
              :placeholder="r.notesPlaceholder"
              class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="mt-2 w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            {{ isSubmitting ? r.submitting : r.submit }}
          </button>
          <p v-if="submitError" class="text-xs text-red-400 text-center">{{ submitError }}</p>
        </form>
      </div>

      <!-- Right column: Check reservation -->
      <div class="bg-black px-4 py-10 md:px-8 md:pl-14">
        <h2 class="text-lg font-semibold text-white mb-8">{{ r.lookupHeading }}</h2>

        <div class="flex gap-3 mb-4">
          <input
            v-model="lookupId"
            type="text"
            :placeholder="r.lookupPlaceholder"
            class="flex-1 min-w-0 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
            @keyup.enter="lookup"
          />
          <button
            @click="lookup"
            class="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {{ r.lookupBtn }}
          </button>
        </div>

        <!-- Error -->
        <p v-if="lookupError" class="text-xs text-red-400 mb-4">{{ lookupError }}</p>

        <!-- Cancel success -->
        <div v-if="cancelDone" class="mt-6 border border-neutral-800 rounded-xl p-6 text-center">
          <p class="text-neutral-400 text-sm">{{ r.cancelDoneMsg }}</p>
        </div>

        <!-- Result card -->
        <div v-if="lookupResult" class="mt-6 border border-neutral-800 rounded-xl overflow-hidden">

          <!-- Header: code + action buttons -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div>
              <p class="text-xs text-neutral-500 uppercase tracking-widest mb-0.5">{{ r.codeLabel }}</p>
              <p class="text-amber-400 font-mono font-semibold tracking-wider">{{ lookupResult.reservation_code }}</p>
            </div>
            <div v-if="!isEditing && !confirmCancel" class="flex gap-2">
              <button
                @click="startEdit"
                class="px-4 py-1.5 text-xs text-white border border-neutral-700 hover:border-neutral-500 rounded-full transition-colors"
              >
                {{ r.editBtn }}
              </button>
              <button
                @click="confirmCancel = true"
                class="px-4 py-1.5 text-xs text-red-400 border border-red-900 hover:border-red-500 rounded-full transition-colors"
              >
                {{ r.cancelBtn }}
              </button>
            </div>
          </div>

          <!-- Cancel confirmation -->
          <div v-if="confirmCancel" class="px-6 py-5 text-sm">
            <p class="text-white mb-4">{{ r.confirmCancelMsg }}</p>
            <p v-if="deleteError" class="text-xs text-red-400 mb-3">{{ deleteError }}</p>
            <div class="flex gap-3">
              <button
                @click="cancelReservation"
                :disabled="isDeleting"
                class="px-5 py-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-xs rounded-full transition-colors"
              >
                {{ isDeleting ? r.canceling : r.cancelConfirm }}
              </button>
              <button
                @click="confirmCancel = false"
                class="px-5 py-2 border border-neutral-700 hover:border-neutral-500 text-white text-xs rounded-full transition-colors"
              >
                {{ r.backBtn }}
              </button>
            </div>
          </div>

          <!-- View mode -->
          <dl v-else-if="!isEditing" class="flex flex-col gap-4 text-sm px-6 py-5">
            <div class="flex justify-between">
              <dt class="text-neutral-500">{{ r.fieldCustomer }}</dt>
              <dd class="text-white font-medium">{{ lookupResult.customer_name }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-neutral-500">{{ r.fieldDate }}</dt>
              <dd class="text-white">{{ formatDate(lookupResult.date) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-neutral-500">{{ r.fieldTime }}</dt>
              <dd class="text-white">{{ lookupResult.time }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-neutral-500">{{ r.fieldPartySize }}</dt>
              <dd class="text-white">{{ lookupResult.party_size }} {{ r.unitPeople }}</dd>
            </div>
            <div v-if="lookupResult.phone" class="flex justify-between">
              <dt class="text-neutral-500">{{ r.fieldPhone }}</dt>
              <dd class="text-white">{{ lookupResult.phone }}</dd>
            </div>
            <div v-if="lookupResult.email" class="flex justify-between">
              <dt class="text-neutral-500">{{ r.fieldEmail }}</dt>
              <dd class="text-white">{{ lookupResult.email }}</dd>
            </div>
            <div v-if="lookupResult.notes" class="flex flex-col gap-1 pt-2 border-t border-neutral-800">
              <dt class="text-neutral-500">{{ r.fieldNotes }}</dt>
              <dd class="text-neutral-300 text-xs leading-relaxed mt-1">{{ lookupResult.notes }}</dd>
            </div>
          </dl>

          <!-- Edit mode -->
          <form v-else @submit.prevent="saveEdit" novalidate class="flex flex-col gap-4 px-6 py-5 text-sm">
            <div>
              <label class="block text-xs text-neutral-500 mb-1.5">{{ r.nameLabel }}</label>
              <input v-model="editForm.name" type="text"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
              <p v-if="editErrors.name" class="mt-1 text-xs text-red-400">{{ editErrors.name }}</p>
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-1.5">{{ r.phoneLabel }}</label>
              <input v-model="editForm.phone" type="tel"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-1.5">{{ r.emailLabel }}</label>
              <input v-model="editForm.email" type="email"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
              <p v-if="editErrors.contact" class="mt-1 text-xs text-red-400">{{ editErrors.contact }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs text-neutral-500 mb-1.5">{{ r.dateLabel }}</label>
                <input v-model="editForm.date" type="date" :min="today"
                  :class="['w-full bg-neutral-900 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors',
                    isEditMonday ? 'border-red-500' : 'border-neutral-700 focus:border-amber-500']" />
                <p v-if="isEditMonday" class="mt-1 text-xs text-red-400">{{ r.errMondayEdit }}</p>
                <p v-else-if="editErrors.date" class="mt-1 text-xs text-red-400">{{ editErrors.date }}</p>
              </div>
              <div>
                <label class="block text-xs text-neutral-500 mb-1.5">{{ r.timeLabel }}</label>
                <select v-model="editForm.time"
                  class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors">
                  <option value="" disabled>{{ r.timePlaceholder }}</option>
                  <optgroup :label="r.lunch">
                    <option v-for="t in timeSlots.slice(0, 5)" :key="t" :value="t">{{ t }}</option>
                  </optgroup>
                  <optgroup :label="r.dinner">
                    <option v-for="t in timeSlots.slice(5)" :key="t" :value="t">{{ t }}</option>
                  </optgroup>
                </select>
                <p v-if="editErrors.time" class="mt-1 text-xs text-red-400">{{ editErrors.time }}</p>
              </div>
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-1.5">{{ r.guestsLabel }}</label>
              <input v-model="editForm.guests" type="number" min="1"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors" />
              <p v-if="editErrors.guests" class="mt-1 text-xs text-red-400">{{ editErrors.guests }}</p>
            </div>
            <div>
              <label class="block text-xs text-neutral-500 mb-1.5">{{ r.notesLabel }}</label>
              <textarea v-model="editForm.notes" rows="2"
                class="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors resize-none" />
            </div>
            <p v-if="saveError" class="text-xs text-red-400">{{ saveError }}</p>
            <div class="flex gap-3 pt-1">
              <button type="submit" :disabled="isSaving"
                class="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs uppercase tracking-widest rounded-full transition-colors">
                {{ isSaving ? r.saving : r.saveBtn }}
              </button>
              <button type="button" @click="isEditing = false"
                class="flex-1 py-2.5 border border-neutral-700 hover:border-neutral-500 text-white text-xs uppercase tracking-widest rounded-full transition-colors">
                {{ r.backBtn }}
              </button>
            </div>
          </form>

        </div>

        <!-- Placeholder when no result yet -->
        <div v-if="!lookupResult && !lookupError" class="mt-10 text-center text-neutral-700 text-sm leading-relaxed">
          <p>{{ r.lookupHint1 }}</p>
          <p>{{ r.lookupHint2 }}</p>
        </div>
      </div>

    </div>

    <FooterSection />
  </div>
</template>
