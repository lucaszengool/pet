import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref({
    id: '',
    nickname: '宠物达人',
    avatar: '',
    phone: '',
    petCount: 0,
    postCount: 0,
    favoriteCount: 0,
    orderCount: 0
  })

  const login = (info: any) => {
    isLoggedIn.value = true
    userInfo.value = { ...userInfo.value, ...info }
  }

  const logout = () => {
    isLoggedIn.value = false
    userInfo.value = {
      id: '',
      nickname: '宠物达人',
      avatar: '',
      phone: '',
      petCount: 0,
      postCount: 0,
      favoriteCount: 0,
      orderCount: 0
    }
  }

  return { isLoggedIn, userInfo, login, logout }
})
