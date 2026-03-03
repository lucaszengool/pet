<template>
  <view class="step-avatar">
    <view class="step-title">头像和名字</view>
    <view class="step-subtitle">给你的宠物设置头像和名字吧</view>

    <view class="avatar-section" @click="chooseAvatar">
      <view class="avatar-circle">
        <image v-if="avatar" :src="avatar" class="avatar-img" mode="aspectFill" />
        <view v-else class="avatar-placeholder">
          <view class="camera-icon">
            <view class="camera-body"></view>
            <view class="camera-lens"></view>
          </view>
        </view>
        <view class="avatar-edit-badge">
          <text class="edit-icon">&#9998;</text>
        </view>
      </view>
    </view>

    <view class="name-section">
      <view class="name-input-wrap">
        <input
          v-model="petName"
          class="name-input"
          placeholder="请输入宠物名字"
          :maxlength="20"
          @input="onNameInput"
        />
        <text class="name-counter">{{ petName.length }}/20</text>
      </view>
      <text class="name-hint">名字中如有数字，建议输入汉字中的数字零至九哦~</text>
    </view>

    <view class="step-footer">
      <view
        class="btn-next"
        :class="{ disabled: !canNext }"
        @click="handleNext"
      >
        下一步
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'next', data: { avatar: string; name: string }): void
}>()

const props = defineProps<{
  data: Record<string, any>
}>()

const avatar = ref(props.data.avatar || '')
const petName = ref(props.data.name || '')

const canNext = computed(() => petName.value.trim().length > 0)

const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      avatar.value = res.tempFilePaths[0]
    }
  })
}

const onNameInput = (e: any) => {
  petName.value = e.detail.value
}

const handleNext = () => {
  if (!canNext.value) return
  emit('next', { avatar: avatar.value, name: petName.value.trim() })
}
</script>

<style lang="scss" scoped>
.step-avatar {
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

.avatar-section {
  margin-bottom: 60rpx;
}

.avatar-circle {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background: #F5F5F0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
}

.avatar-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-icon {
  position: relative;
  width: 64rpx;
  height: 48rpx;
}

.camera-body {
  width: 64rpx;
  height: 44rpx;
  border-radius: 10rpx;
  background: #ccc;
  position: absolute;
  bottom: 0;
}

.camera-lens {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: #F5F5F0;
  border: 4rpx solid #ccc;
  position: absolute;
  bottom: 8rpx;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-edit-badge {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #F5A623;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(245, 166, 35, 0.3);
}

.edit-icon {
  font-size: 24rpx;
  color: #fff;
}

.name-section {
  width: 100%;
}

.name-input-wrap {
  display: flex;
  align-items: center;
  border: 2rpx solid #E8E4DE;
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 96rpx;
  background: #fff;
}

.name-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.name-counter {
  font-size: 24rpx;
  color: #ccc;
  flex-shrink: 0;
  margin-left: 16rpx;
}

.name-hint {
  display: block;
  font-size: 24rpx;
  color: #C4B998;
  margin-top: 16rpx;
  text-align: center;
}

.step-footer {
  width: 100%;
  margin-top: 80rpx;
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
