<template>
  <view class="setup-page">
    <!-- Custom Nav Bar -->
    <view class="setup-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="setup-nav">
        <view class="nav-back" @click="goBack">
          <text class="back-arrow">&#x2039;</text>
        </view>
        <text class="nav-title">{{ stepTitles[currentStep] }}</text>
        <view class="nav-placeholder"></view>
      </view>
      <!-- Progress bar -->
      <view class="progress-wrap">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </view>
    </view>

    <!-- Step Content -->
    <view class="setup-body" :style="{ paddingTop: (statusBarHeight + 100) + 'px' }">
      <SetupAvatar
        v-if="currentStep === 0"
        :data="petFormData"
        @next="onAvatarNext"
      />
      <SetupPetType
        v-if="currentStep === 1"
        :data="petFormData"
        @next="onTypeNext"
      />
      <SetupBreed
        v-if="currentStep === 2"
        :data="petFormData"
        @next="onBreedNext"
        @skip="onBreedSkip"
      />
      <SetupGender
        v-if="currentStep === 3"
        :data="petFormData"
        @next="onGenderNext"
        @skip="onGenderSkip"
      />
      <SetupBirthDate
        v-if="currentStep === 4"
        :data="petFormData"
        @next="onDateNext"
        @skip="onDateSkip"
      />
      <SetupWeight
        v-if="currentStep === 5"
        :data="petFormData"
        @complete="onWeightComplete"
        @skip="onWeightSkip"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { usePetStore } from '@/stores/pet'
import type { PetProfile, PetType, PetGender, NeuterStatus } from '@/types/pet'
import SetupAvatar from '@/components/pet-setup/SetupAvatar.vue'
import SetupPetType from '@/components/pet-setup/SetupPetType.vue'
import SetupBreed from '@/components/pet-setup/SetupBreed.vue'
import SetupGender from '@/components/pet-setup/SetupGender.vue'
import SetupBirthDate from '@/components/pet-setup/SetupBirthDate.vue'
import SetupWeight from '@/components/pet-setup/SetupWeight.vue'

const petStore = usePetStore()
const statusBarHeight = ref(0)
const currentStep = ref(0)
const totalSteps = 6

uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 44
  }
})

const stepTitles = ['头像和名字', '选择类型', '选择品种', '选择性别和绝育', '选择出生和到家日期', '选择体重']

const progressPercent = computed(() => ((currentStep.value + 1) / totalSteps) * 100)

const petFormData = reactive<Record<string, any>>({
  avatar: '',
  name: '',
  type: null,
  breed: null,
  gender: null,
  neuterStatus: null,
  birthDate: null,
  arrivalDate: null,
  age: null,
  weight: null,
})

const goBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  } else {
    uni.navigateBack()
  }
}

const nextStep = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  }
}

// Step handlers
const onAvatarNext = (data: { avatar: string; name: string }) => {
  petFormData.avatar = data.avatar
  petFormData.name = data.name
  nextStep()
}

const onTypeNext = (data: { type: PetType }) => {
  petFormData.type = data.type
  petFormData.breed = null // Reset breed when type changes
  nextStep()
}

const onBreedNext = (data: { breed: string }) => {
  petFormData.breed = data.breed
  nextStep()
}

const onBreedSkip = () => {
  petFormData.breed = null
  nextStep()
}

const onGenderNext = (data: { gender: PetGender; neuterStatus: NeuterStatus | null }) => {
  petFormData.gender = data.gender
  petFormData.neuterStatus = data.neuterStatus
  nextStep()
}

const onGenderSkip = () => {
  petFormData.gender = null
  petFormData.neuterStatus = null
  nextStep()
}

const onDateNext = (data: { birthDate: string | null; arrivalDate: string | null; age: string | null }) => {
  petFormData.birthDate = data.birthDate
  petFormData.arrivalDate = data.arrivalDate
  petFormData.age = data.age
  nextStep()
}

const onDateSkip = () => {
  petFormData.birthDate = null
  petFormData.arrivalDate = null
  petFormData.age = null
  nextStep()
}

const completeSetup = (weight: number | null) => {
  const now = new Date().toISOString()
  const pet: PetProfile = {
    id: 'pet_' + Date.now(),
    avatar: petFormData.avatar,
    name: petFormData.name,
    type: petFormData.type,
    breed: petFormData.breed,
    gender: petFormData.gender,
    neuterStatus: petFormData.neuterStatus,
    birthDate: petFormData.birthDate,
    arrivalDate: petFormData.arrivalDate,
    age: petFormData.age,
    weight: weight,
    createdAt: now,
    updatedAt: now,
  }
  petStore.addPet(pet)
  uni.showToast({ title: '创建成功', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

const onWeightComplete = (data: { weight: number }) => {
  completeSetup(data.weight)
}

const onWeightSkip = () => {
  completeSetup(null)
}
</script>

<style lang="scss" scoped>
.setup-page {
  min-height: 100vh;
  background: #fff;
}

.setup-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
}

.setup-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
}

.nav-back {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-arrow {
  font-size: 56rpx;
  color: #333;
  line-height: 1;
  font-weight: 300;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.nav-placeholder {
  width: 60rpx;
}

.progress-wrap {
  padding: 0 32rpx 12rpx;
}

.progress-bar {
  height: 6rpx;
  background: #F0EDE8;
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD54F, #F5A623);
  border-radius: 3rpx;
  transition: width 0.3s ease;
}

.setup-body {
  min-height: 100vh;
}
</style>
