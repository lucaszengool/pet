import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PetProfile } from '@/types/pet'

export const usePetStore = defineStore('pet', () => {
  const pets = ref<PetProfile[]>([])
  const onboardingDismissed = ref(false)
  const onboardingCompleted = ref(false)

  const hasPets = computed(() => pets.value.length > 0)
  const shouldShowOnboarding = computed(() =>
    !hasPets.value && !onboardingDismissed.value && !onboardingCompleted.value
  )

  const addPet = (pet: PetProfile) => {
    pets.value.push(pet)
    onboardingCompleted.value = true
    saveToStorage()
  }

  const updatePet = (id: string, updates: Partial<PetProfile>) => {
    const idx = pets.value.findIndex(p => p.id === id)
    if (idx >= 0) {
      pets.value[idx] = { ...pets.value[idx], ...updates, updatedAt: new Date().toISOString() }
      saveToStorage()
    }
  }

  const dismissOnboarding = () => {
    onboardingDismissed.value = true
    saveToStorage()
  }

  const saveToStorage = () => {
    uni.setStorageSync('pet_profiles', JSON.stringify(pets.value))
    uni.setStorageSync('pet_onboarding_dismissed', onboardingDismissed.value)
    uni.setStorageSync('pet_onboarding_completed', onboardingCompleted.value)
  }

  const loadFromStorage = () => {
    try {
      const stored = uni.getStorageSync('pet_profiles')
      if (stored) pets.value = JSON.parse(stored)
      onboardingDismissed.value = !!uni.getStorageSync('pet_onboarding_dismissed')
      onboardingCompleted.value = !!uni.getStorageSync('pet_onboarding_completed')
    } catch (e) {
      console.error('Failed to load pet data', e)
    }
  }

  loadFromStorage()

  return {
    pets,
    hasPets,
    onboardingDismissed,
    onboardingCompleted,
    shouldShowOnboarding,
    addPet,
    updatePet,
    dismissOnboarding,
    loadFromStorage,
  }
})
