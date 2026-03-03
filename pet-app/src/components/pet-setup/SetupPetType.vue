<template>
  <view class="step-type">
    <view class="step-title">选择类型</view>
    <view class="step-subtitle">你的宠物是什么类型呢</view>

    <view class="type-grid">
      <view
        v-for="item in petTypes"
        :key="item.value"
        class="type-item"
        :class="{ selected: selectedType === item.value }"
        @click="selectedType = item.value"
      >
        <view class="type-circle" :class="item.value">
          <view class="type-icon-wrap">
            <view :class="'pet-icon-' + item.value"></view>
          </view>
        </view>
        <text class="type-label">{{ item.label }}</text>
      </view>
    </view>

    <view class="step-footer">
      <view
        class="btn-next"
        :class="{ disabled: !selectedType }"
        @click="handleNext"
      >
        下一步
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PetType } from '@/types/pet'

const emit = defineEmits<{
  (e: 'next', data: { type: PetType }): void
}>()

const props = defineProps<{
  data: Record<string, any>
}>()

const selectedType = ref<PetType | null>(props.data.type || null)

const petTypes = [
  { value: 'cat' as PetType, label: '猫咪' },
  { value: 'dog' as PetType, label: '狗狗' },
  { value: 'other' as PetType, label: '其他' },
]

const handleNext = () => {
  if (!selectedType.value) return
  emit('next', { type: selectedType.value })
}
</script>

<style lang="scss" scoped>
.step-type {
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
  margin-bottom: 80rpx;
}

.type-grid {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  width: 100%;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;

  &.selected .type-circle {
    border: 4rpx solid #F5A623;
    box-shadow: 0 4rpx 20rpx rgba(245, 166, 35, 0.2);
  }

  &.selected .type-label {
    color: #F5A623;
    font-weight: 600;
  }
}

.type-circle {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
  background: #F8F6F1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid transparent;
  transition: all 0.2s ease;
}

.type-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

// CSS-based pet type icons
.pet-icon-cat {
  width: 60rpx;
  height: 52rpx;
  border-radius: 50% 50% 40% 40%;
  background: #E8DCC8;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -16rpx;
    width: 20rpx;
    height: 24rpx;
    background: #E8DCC8;
    border-radius: 4rpx 4rpx 0 0;
  }

  &::before {
    left: 6rpx;
    transform: rotate(-15deg);
  }

  &::after {
    right: 6rpx;
    transform: rotate(15deg);
  }
}

.pet-icon-dog {
  width: 60rpx;
  height: 56rpx;
  border-radius: 44% 44% 40% 40%;
  background: #DEC89C;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 4rpx;
    width: 20rpx;
    height: 28rpx;
    background: #C9B07A;
    border-radius: 50% 50% 50% 50%;
  }

  &::before {
    left: -6rpx;
    transform: rotate(-20deg);
  }

  &::after {
    right: -6rpx;
    transform: rotate(20deg);
  }
}

.pet-icon-other {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid #C4B998;
  border-radius: 50%;
  position: relative;

  &::before {
    content: '?';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32rpx;
    color: #C4B998;
    font-weight: 700;
  }
}

.type-label {
  font-size: 28rpx;
  color: #666;
}

.step-footer {
  width: 100%;
  margin-top: 100rpx;
  display: flex;
  justify-content: center;
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
</style>
