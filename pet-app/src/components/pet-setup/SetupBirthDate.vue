<template>
  <view class="step-date">
    <view class="step-title">选择出生和到家日期</view>
    <view class="step-subtitle">帮助我们记录你们的重要时刻</view>

    <view class="form-section">
      <text class="form-label">出生日期</text>
      <picker mode="date" :value="birthDate" :end="today" @change="onBirthChange">
        <view class="date-picker">
          <text :class="{ placeholder: !birthDate }">
            {{ birthDate || '请选择宠物的出生日期' }}
          </text>
          <text class="picker-arrow">&#x203A;</text>
        </view>
      </picker>
    </view>

    <view class="form-section">
      <view class="age-input-wrap">
        <input
          v-model="ageText"
          class="age-input"
          placeholder="宠物年龄"
          @input="onAgeInput"
        />
      </view>
      <text class="age-hint">流浪猫狗等可直接在此输入预估年龄</text>
    </view>

    <view class="form-section">
      <text class="form-label">到家日期</text>
      <picker mode="date" :value="arrivalDate" :end="today" @change="onArrivalChange">
        <view class="date-picker">
          <text :class="{ placeholder: !arrivalDate }">
            {{ arrivalDate || '请选择宠物的到家日期' }}
          </text>
          <text class="picker-arrow">&#x203A;</text>
        </view>
      </picker>
    </view>

    <view class="step-footer">
      <view
        class="btn-next"
        :class="{ disabled: !canNext }"
        @click="handleNext"
      >
        下一步
      </view>
      <view class="btn-skip" @click="$emit('skip')">
        跳过（暂不确定）
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'next', data: { birthDate: string | null; arrivalDate: string | null; age: string | null }): void
  (e: 'skip'): void
}>()

const props = defineProps<{
  data: Record<string, any>
}>()

const birthDate = ref(props.data.birthDate || '')
const arrivalDate = ref(props.data.arrivalDate || '')
const ageText = ref(props.data.age || '')

const today = new Date().toISOString().split('T')[0]

const canNext = computed(() => birthDate.value || arrivalDate.value || ageText.value)

const onBirthChange = (e: any) => {
  birthDate.value = e.detail.value
}

const onArrivalChange = (e: any) => {
  arrivalDate.value = e.detail.value
}

const onAgeInput = (e: any) => {
  ageText.value = e.detail.value
}

const handleNext = () => {
  if (!canNext.value) return
  emit('next', {
    birthDate: birthDate.value || null,
    arrivalDate: arrivalDate.value || null,
    age: ageText.value || null
  })
}
</script>

<style lang="scss" scoped>
.step-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 48rpx 0;
}

.step-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-bottom: 12rpx;
}

.step-subtitle {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 60rpx;
}

.form-section {
  width: 100%;
  margin-bottom: 40rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 2rpx solid #E8E4DE;
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 96rpx;

  text {
    font-size: 28rpx;
    color: #333;

    &.placeholder {
      color: #C4B998;
    }
  }
}

.picker-arrow {
  font-size: 36rpx;
  color: #ccc;
}

.age-input-wrap {
  background: #F8F6F1;
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
}

.age-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.age-hint {
  display: block;
  font-size: 24rpx;
  color: #C4B998;
  margin-top: 12rpx;
  text-align: center;
}

.step-footer {
  width: 100%;
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.btn-next {
  width: 400rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #FFD54F, #F5A623);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 4rpx;

  &.disabled {
    background: #E8E4DE;
    color: #fff;
  }
}

.btn-skip {
  font-size: 28rpx;
  color: #C4B998;
  padding: 12rpx 0;
}
</style>
