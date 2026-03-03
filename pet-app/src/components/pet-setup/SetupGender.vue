<template>
  <view class="step-gender">
    <view class="step-title">选择性别和绝育</view>
    <view class="step-subtitle">帮助我们更好地了解你的宠物</view>

    <view class="gender-grid">
      <view
        class="gender-item"
        :class="{ selected: selectedGender === 'male' }"
        @click="selectedGender = 'male'"
      >
        <view class="gender-circle male">
          <view class="gender-icon">
            <view class="icon-male"></view>
          </view>
        </view>
        <text class="gender-label">男孩子</text>
      </view>

      <view
        class="gender-item"
        :class="{ selected: selectedGender === 'female' }"
        @click="selectedGender = 'female'"
      >
        <view class="gender-circle female">
          <view class="gender-icon">
            <view class="icon-female"></view>
          </view>
        </view>
        <text class="gender-label">女孩子</text>
      </view>

      <view
        class="gender-item"
        :class="{ selected: neuterStatus === 'not_neutered' }"
        @click="neuterStatus = 'not_neutered'"
      >
        <view class="gender-circle neutral">
          <view class="neuter-text">N</view>
        </view>
        <text class="gender-label">未绝育</text>
      </view>

      <view
        class="gender-item"
        :class="{ selected: neuterStatus === 'neutered' }"
        @click="neuterStatus = 'neutered'"
      >
        <view class="gender-circle neutral">
          <view class="neuter-text">Y</view>
        </view>
        <text class="gender-label">已绝育</text>
      </view>
    </view>

    <view class="step-footer">
      <view
        class="btn-next"
        :class="{ disabled: !selectedGender }"
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
import { ref } from 'vue'
import type { PetGender, NeuterStatus } from '@/types/pet'

const emit = defineEmits<{
  (e: 'next', data: { gender: PetGender; neuterStatus: NeuterStatus | null }): void
  (e: 'skip'): void
}>()

const props = defineProps<{
  data: Record<string, any>
}>()

const selectedGender = ref<PetGender | null>(props.data.gender || null)
const neuterStatus = ref<NeuterStatus | null>(props.data.neuterStatus || null)

const handleNext = () => {
  if (!selectedGender.value) return
  emit('next', {
    gender: selectedGender.value,
    neuterStatus: neuterStatus.value
  })
}
</script>

<style lang="scss" scoped>
.step-gender {
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

.gender-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40rpx;
  width: 100%;
  max-width: 500rpx;
}

.gender-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  width: calc(50% - 20rpx);

  &.selected .gender-circle {
    border: 4rpx solid #F5A623;
    box-shadow: 0 4rpx 20rpx rgba(245, 166, 35, 0.15);
  }

  &.selected .gender-label {
    color: #F5A623;
    font-weight: 600;
  }
}

.gender-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid transparent;
  transition: all 0.2s ease;

  &.male {
    background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
  }

  &.female {
    background: linear-gradient(135deg, #FCE4EC, #F8BBD0);
  }

  &.neutral {
    background: #F5F5F0;
  }
}

.gender-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-male {
  width: 44rpx;
  height: 44rpx;
  border: 5rpx solid #42A5F5;
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -8rpx;
    right: -16rpx;
    width: 24rpx;
    height: 5rpx;
    background: #42A5F5;
    transform: rotate(-45deg);
  }
}

.icon-female {
  width: 44rpx;
  height: 44rpx;
  border: 5rpx solid #E91E63;
  border-radius: 50%;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -24rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 5rpx;
    height: 24rpx;
    background: #E91E63;
  }
}

.neuter-text {
  font-size: 40rpx;
  font-weight: 700;
  color: #C4B998;
}

.gender-label {
  font-size: 28rpx;
  color: #666;
}

.step-footer {
  width: 100%;
  margin-top: 80rpx;
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
