<template>
  <view class="step-weight">
    <view class="step-title">选择体重</view>
    <view class="step-subtitle">记录宠物当前体重</view>

    <!-- Weight display bubble -->
    <view class="weight-display">
      <view class="weight-bubble" @click="showManualInput">
        <text class="weight-value">{{ displayWeight }}</text>
        <text class="weight-unit">kg</text>
      </view>
      <view class="weight-arrow"></view>
    </view>

    <!-- Scroll ruler -->
    <view class="ruler-container">
      <view class="ruler-center-line"></view>
      <scroll-view
        scroll-x
        class="ruler-scroll"
        :scroll-left="scrollLeft"
        @scroll="onScroll"
        scroll-with-animation
      >
        <view class="ruler-track" :style="{ width: rulerWidth + 'px' }">
          <view class="ruler-padding"></view>
          <view
            v-for="(tick, idx) in ticks"
            :key="idx"
            class="ruler-tick"
            :class="{ major: tick.major, mid: tick.mid }"
          >
            <view class="tick-line"></view>
            <text v-if="tick.major" class="tick-label">{{ tick.label }}</text>
          </view>
          <view class="ruler-padding"></view>
        </view>
      </scroll-view>
    </view>

    <text class="weight-hint" @click="showManualInput">点击数字可直接输入哦~</text>

    <view class="step-footer">
      <view class="btn-next" @click="handleComplete">
        完成
      </view>
      <view class="btn-skip" @click="$emit('skip')">
        跳过（暂不确定）
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'complete', data: { weight: number }): void
  (e: 'skip'): void
}>()

const props = defineProps<{
  data: Record<string, any>
}>()

const weight = ref(props.data.weight || 5.0)
const scrollLeft = ref(0)

const TICK_WIDTH = 8 // px per 0.1kg
const MIN_WEIGHT = 0.5
const MAX_WEIGHT = 50
const TICK_COUNT = (MAX_WEIGHT - MIN_WEIGHT) * 10

const rulerWidth = computed(() => TICK_COUNT * TICK_WIDTH + 375) // 375 for padding

const displayWeight = computed(() => weight.value.toFixed(2))

const ticks = computed(() => {
  const result = []
  for (let i = 0; i <= TICK_COUNT; i++) {
    const val = MIN_WEIGHT + i * 0.1
    const rounded = Math.round(val * 10) / 10
    result.push({
      major: rounded % 1 === 0,
      mid: rounded % 0.5 === 0 && rounded % 1 !== 0,
      label: rounded % 1 === 0 ? String(Math.round(rounded)) : ''
    })
  }
  return result
})

const onScroll = (e: any) => {
  const left = e.detail.scrollLeft
  const tickIndex = Math.round(left / TICK_WIDTH)
  const newWeight = Math.min(MAX_WEIGHT, Math.max(MIN_WEIGHT, MIN_WEIGHT + tickIndex * 0.1))
  weight.value = Math.round(newWeight * 100) / 100
}

const showManualInput = () => {
  uni.showModal({
    title: '输入体重(kg)',
    editable: true,
    placeholderText: String(weight.value),
    success: (res) => {
      if (res.confirm && res.content) {
        const val = parseFloat(res.content)
        if (!isNaN(val) && val >= MIN_WEIGHT && val <= MAX_WEIGHT) {
          weight.value = Math.round(val * 100) / 100
          scrollLeft.value = (weight.value - MIN_WEIGHT) * 10 * TICK_WIDTH
        }
      }
    }
  })
}

const handleComplete = () => {
  emit('complete', { weight: weight.value })
}

onMounted(() => {
  // Scroll to initial weight
  setTimeout(() => {
    scrollLeft.value = (weight.value - MIN_WEIGHT) * 10 * TICK_WIDTH
  }, 100)
})
</script>

<style lang="scss" scoped>
.step-weight {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 0;
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

.weight-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
}

.weight-bubble {
  display: flex;
  align-items: baseline;
  background: linear-gradient(135deg, #FF8A65, #EF6C50);
  padding: 16rpx 32rpx;
  border-radius: 20rpx;
  gap: 4rpx;
}

.weight-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
}

.weight-unit {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.weight-arrow {
  width: 0;
  height: 0;
  border-left: 16rpx solid transparent;
  border-right: 16rpx solid transparent;
  border-top: 16rpx solid #EF6C50;
}

.ruler-container {
  width: 100%;
  position: relative;
  height: 160rpx;
  margin-top: 20rpx;
}

.ruler-center-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 60rpx;
  width: 4rpx;
  background: #EF6C50;
  z-index: 2;
  transform: translateX(-50%);
}

.ruler-scroll {
  width: 100%;
  height: 160rpx;
}

.ruler-track {
  display: flex;
  align-items: flex-start;
  height: 120rpx;
  padding-top: 20rpx;
}

.ruler-padding {
  width: 50vw;
  flex-shrink: 0;
}

.ruler-tick {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 8px;
  flex-shrink: 0;

  .tick-line {
    width: 2rpx;
    height: 24rpx;
    background: #ddd;
  }

  &.mid .tick-line {
    height: 36rpx;
    background: #bbb;
  }

  &.major .tick-line {
    height: 48rpx;
    background: #999;
  }

  .tick-label {
    font-size: 22rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.weight-hint {
  font-size: 24rpx;
  color: #C4B998;
  margin-top: 16rpx;
}

.step-footer {
  width: 100%;
  margin-top: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  padding: 0 48rpx;
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
}

.btn-skip {
  font-size: 28rpx;
  color: #C4B998;
  padding: 12rpx 0;
}
</style>
