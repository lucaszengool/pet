import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentTab = ref(0)
  const searchHistory = ref<string[]>([])
  const location = ref({
    city: '北京',
    latitude: 0,
    longitude: 0
  })

  const setTab = (index: number) => {
    currentTab.value = index
  }

  const addSearchHistory = (keyword: string) => {
    const idx = searchHistory.value.indexOf(keyword)
    if (idx > -1) searchHistory.value.splice(idx, 1)
    searchHistory.value.unshift(keyword)
    if (searchHistory.value.length > 10) searchHistory.value.pop()
  }

  const clearSearchHistory = () => {
    searchHistory.value = []
  }

  return { currentTab, searchHistory, location, setTab, addSearchHistory, clearSearchHistory }
})
