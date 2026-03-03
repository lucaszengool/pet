<template>
  <view class="settings-page">
    <view class="settings-group">
      <view class="settings-item" @click="goPage('profile')">
        <view class="item-icon"><IconSymbol name="user" :size="36" color="#666" /></view>
        <text class="item-label">个人信息</text>
        <text class="item-arrow">></text>
      </view>
      <view class="settings-item" @click="goPage('address')">
        <view class="item-icon"><IconSymbol name="location" :size="36" color="#666" /></view>
        <text class="item-label">地址管理</text>
        <text class="item-arrow">></text>
      </view>
      <view class="settings-item" @click="goPage('account')">
        <view class="item-icon"><IconSymbol name="lock" :size="36" color="#666" /></view>
        <text class="item-label">账号与安全</text>
        <text class="item-arrow">></text>
      </view>
    </view>

    <view class="settings-group">
      <view class="settings-item" @click="goPage('notification')">
        <view class="item-icon"><IconSymbol name="bell" :size="36" color="#666" /></view>
        <text class="item-label">消息通知设置</text>
        <text class="item-arrow">></text>
      </view>
      <view class="settings-item" @click="goPage('privacy')">
        <view class="item-icon"><IconSymbol name="shield" :size="36" color="#666" /></view>
        <text class="item-label">隐私设置</text>
        <text class="item-arrow">></text>
      </view>
      <view class="settings-item">
        <view class="item-icon"><IconSymbol name="moon" :size="36" color="#666" /></view>
        <text class="item-label">深色模式</text>
        <switch :checked="darkMode" @change="toggleDarkMode" color="#F5A623" />
      </view>
    </view>

    <view class="settings-group">
      <view class="settings-item" @click="goPage('about')">
        <view class="item-icon"><IconSymbol name="info" :size="36" color="#666" /></view>
        <text class="item-label">关于宠我吧</text>
        <view class="item-right">
          <text class="item-value">v1.0.0</text>
          <text class="item-arrow">></text>
        </view>
      </view>
      <view class="settings-item" @click="goPage('help')">
        <view class="item-icon"><IconSymbol name="help" :size="36" color="#666" /></view>
        <text class="item-label">帮助与反馈</text>
        <text class="item-arrow">></text>
      </view>
      <view class="settings-item" @click="clearCache">
        <view class="item-icon"><IconSymbol name="trash" :size="36" color="#666" /></view>
        <text class="item-label">清除缓存</text>
        <view class="item-right">
          <text class="item-value">12.3MB</text>
          <text class="item-arrow">></text>
        </view>
      </view>
    </view>

    <view class="settings-group">
      <view class="settings-item" @click="goPage('agreement')">
        <view class="item-icon"><IconSymbol name="document" :size="36" color="#666" /></view>
        <text class="item-label">用户协议</text>
        <text class="item-arrow">></text>
      </view>
      <view class="settings-item" @click="goPage('privacy-policy')">
        <view class="item-icon"><IconSymbol name="clipboard" :size="36" color="#666" /></view>
        <text class="item-label">隐私政策</text>
        <text class="item-arrow">></text>
      </view>
    </view>

    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const darkMode = ref(false)

const toggleDarkMode = (e: any) => {
  darkMode.value = e.detail.value
  uni.showToast({ title: darkMode.value ? '深色模式已开启' : '深色模式已关闭', icon: 'none' })
}

const goPage = (page: string) => {
  uni.showToast({ title: `${page} 页面开发中`, icon: 'none' })
}

const clearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '确定要清除缓存吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '缓存已清除', icon: 'success' })
      }
    }
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/home/index' })
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.settings-page { background: #F5F5F5; min-height: 100vh; padding-top: 16rpx; }
.settings-group { background: #fff; border-radius: 20rpx; margin: 0 24rpx 20rpx; overflow: hidden; }
.settings-item { display: flex; align-items: center; padding: 28rpx 24rpx; border-bottom: 1rpx solid #f5f5f5; &:last-child { border-bottom: none; } .item-icon { font-size: 36rpx; margin-right: 16rpx; } .item-label { flex: 1; font-size: 28rpx; color: #333; } .item-arrow { font-size: 24rpx; color: #ccc; } .item-right { display: flex; align-items: center; gap: 8rpx; .item-value { font-size: 24rpx; color: #999; } } }
.logout-section { padding: 40rpx 24rpx; }
.logout-btn { width: 100%; height: 88rpx; background: #fff; color: #FF4444; font-size: 30rpx; font-weight: 600; border-radius: 44rpx; border: none; display: flex; align-items: center; justify-content: center; &::after { border: none; } }
</style>
