<template>
  <view class="page-container profile-page">
    <!-- Header with gradient -->
    <view class="profile-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="profile-header-content">
        <text class="profile-title">我的</text>
        <view class="header-actions" @click="goSettings">
          <IconSymbol name="settings" :size="40" color="#666" />
        </view>
      </view>

      <!-- User Card -->
      <view class="user-card">
        <view class="avatar-wrap" @click="handleAvatar">
          <view class="avatar">
            <IconSymbol name="cat" :size="60" color="#F5A623" />
          </view>
          <text class="avatar-hint">点击上传头像</text>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userInfo.nickname }}</text>
          <view class="user-id">
            <text>ID: 10086888</text>
            <text class="switch-btn" @click="switchAccount"><IconSymbol name="exchange" :size="28" color="#999" /> 切换账号</text>
          </view>
          <view class="user-homepage" @click="goHomepage">
            <text>铲屎官主页 ></text>
          </view>
        </view>
      </view>

      <!-- Stats -->
      <view class="stats-row">
        <view class="stat-item" @click="goMyPets">
          <text class="stat-num">{{ userInfo.petCount }}</text>
          <text class="stat-label">宠物</text>
        </view>
        <view class="stat-item" @click="goMyPosts">
          <text class="stat-num">{{ userInfo.postCount }}</text>
          <text class="stat-label">发布</text>
        </view>
        <view class="stat-item" @click="goMyFavorites">
          <text class="stat-num">{{ userInfo.favoriteCount }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item" @click="goMyOrders">
          <text class="stat-num">{{ userInfo.orderCount }}</text>
          <text class="stat-label">订单</text>
        </view>
      </view>
    </view>

    <view class="profile-body" :style="{ paddingTop: (statusBarHeight + 380) + 'px' }">
      <!-- Points Card -->
      <view class="card points-card">
        <view class="points-header">
          <text class="points-title"><IconSymbol name="trophy" :size="36" color="#F5A623" /> 积分中心</text>
          <text class="points-arrow">></text>
        </view>
        <view class="points-grid">
          <view class="points-item">
            <view class="points-icon"><IconSymbol name="calendar" :size="36" color="#F5A623" /></view>
            <text class="points-name">签到</text>
            <text class="points-desc">已连续签到3天</text>
          </view>
          <view class="points-item">
            <view class="points-icon"><IconSymbol name="fish" :size="36" color="#F5A623" /></view>
            <text class="points-name">积分</text>
            <text class="points-desc">共有280积分</text>
          </view>
          <view class="points-item">
            <view class="points-icon"><IconSymbol name="coupon" :size="36" color="#F5A623" /></view>
            <text class="points-name">优惠券</text>
            <text class="points-desc">3张可用</text>
          </view>
        </view>
      </view>

      <!-- Orders Section -->
      <view class="card">
        <view class="section-header" @click="goMyOrders">
          <text class="section-label"><IconSymbol name="package" :size="36" color="#666" /> 我的订单</text>
          <text class="section-arrow">查看全部 ></text>
        </view>
        <view class="order-grid">
          <view class="order-item" @click="goOrderTab('pending')">
            <view class="order-icon"><IconSymbol name="money" :size="36" color="#F5A623" /></view>
            <text class="order-text">待付款</text>
            <view class="order-badge">1</view>
          </view>
          <view class="order-item" @click="goOrderTab('paid')">
            <view class="order-icon"><IconSymbol name="clipboard" :size="36" color="#F5A623" /></view>
            <text class="order-text">待服务</text>
          </view>
          <view class="order-item" @click="goOrderTab('serving')">
            <view class="order-icon"><IconSymbol name="refresh" :size="36" color="#F5A623" /></view>
            <text class="order-text">进行中</text>
          </view>
          <view class="order-item" @click="goOrderTab('completed')">
            <view class="order-icon"><IconSymbol name="star" :size="36" color="#F5A623" /></view>
            <text class="order-text">待评价</text>
            <view class="order-badge">2</view>
          </view>
          <view class="order-item" @click="goOrderTab('refund')">
            <view class="order-icon"><IconSymbol name="return" :size="36" color="#F5A623" /></view>
            <text class="order-text">退款</text>
          </view>
        </view>
      </view>

      <!-- Common Functions -->
      <view class="card">
        <text class="card-title">常用功能</text>
        <view class="func-grid">
          <view class="func-item" @click="goFunc('pets')">
            <view class="func-icon"><IconSymbol name="paw" :size="36" color="#F5A623" /></view>
            <text class="func-text">我的宠物</text>
          </view>
          <view class="func-item" @click="goFunc('favorites')">
            <view class="func-icon"><IconSymbol name="heart" :size="36" color="#F5A623" /></view>
            <text class="func-text">我的收藏</text>
          </view>
          <view class="func-item" @click="goFunc('history')">
            <view class="func-icon"><IconSymbol name="eye" :size="36" color="#F5A623" /></view>
            <text class="func-text">浏览记录</text>
          </view>
          <view class="func-item" @click="goFunc('wallet')">
            <view class="func-icon"><IconSymbol name="money" :size="36" color="#F5A623" /></view>
            <text class="func-text">我的钱包</text>
          </view>
          <view class="func-item" @click="goFunc('address')">
            <view class="func-icon"><IconSymbol name="location" :size="36" color="#F5A623" /></view>
            <text class="func-text">地址管理</text>
          </view>
          <view class="func-item" @click="goFunc('feedback')">
            <view class="func-icon"><IconSymbol name="phone" :size="36" color="#F5A623" /></view>
            <text class="func-text">客服反馈</text>
          </view>
          <view class="func-item" @click="goFunc('knowledge')">
            <view class="func-icon"><IconSymbol name="book" :size="36" color="#F5A623" /></view>
            <text class="func-text">养宠知识</text>
          </view>
          <view class="func-item" @click="goFunc('settings')">
            <view class="func-icon"><IconSymbol name="settings" :size="36" color="#F5A623" /></view>
            <text class="func-text">设置</text>
          </view>
        </view>
      </view>

      <!-- Banner Ad -->
      <view class="card ad-banner">
        <view class="ad-content">
          <text class="ad-title"><IconSymbol name="cat" :size="36" color="rgba(255,255,255,0.7)" /> 快乐宠友星球</text>
          <text class="ad-desc">加入社区，分享养宠乐趣</text>
        </view>
        <view class="ad-btn">GO</view>
      </view>

      <view style="height: 40rpx;"></view>
    </view>

    <TabBar :current="4" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TabBar from '@/components/TabBar.vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const statusBarHeight = ref(44)
uni.getSystemInfo({ success: (res) => { statusBarHeight.value = res.statusBarHeight || 44 } })

const userInfo = reactive({
  nickname: '宠物达人',
  petCount: 2,
  postCount: 5,
  favoriteCount: 12,
  orderCount: 3
})

const handleAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      uni.showToast({ title: '头像上传成功', icon: 'success' })
    }
  })
}

const switchAccount = () => uni.showToast({ title: '切换账号', icon: 'none' })
const goHomepage = () => uni.showToast({ title: '个人主页开发中', icon: 'none' })
const goSettings = () => uni.navigateTo({ url: '/pages/settings/index' })
const goMyPets = () => uni.showToast({ title: '我的宠物', icon: 'none' })
const goMyPosts = () => uni.showToast({ title: '我的发布', icon: 'none' })
const goMyFavorites = () => uni.showToast({ title: '我的收藏', icon: 'none' })
const goMyOrders = () => uni.navigateTo({ url: '/pages/order/index' })
const goOrderTab = (tab: string) => uni.navigateTo({ url: '/pages/order/index?tab=' + tab })
const goFunc = (func: string) => {
  if (func === 'settings') {
    uni.navigateTo({ url: '/pages/settings/index' })
  } else {
    uni.showToast({ title: `${func}功能开发中`, icon: 'none' })
  }
}
</script>

<style lang="scss" scoped>
.profile-page {
  background: #F5F5F5;
}

.profile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, #FFD54F 0%, #FFE082 50%, #FFF8E1 100%);
  padding-bottom: 24rpx;
}

.profile-header-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.profile-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.header-icon {
  font-size: 40rpx;
}

/* User Card */
.user-card {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
}

.avatar-wrap {
  margin-right: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.avatar-emoji {
  font-size: 56rpx;
}

.avatar-hint {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}

.user-info {
  flex: 1;

  .user-name {
    font-size: 34rpx;
    font-weight: 700;
    color: #333;
    display: block;
  }

  .user-id {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #999;

    .switch-btn {
      color: #F5A623;
      font-size: 24rpx;
    }
  }

  .user-homepage {
    margin-top: 8rpx;
    font-size: 24rpx;
    color: #F5A623;
    background: rgba(245, 166, 35, 0.1);
    padding: 6rpx 16rpx;
    border-radius: 12rpx;
    display: inline-block;
  }
}

/* Stats */
.stats-row {
  display: flex;
  padding: 16rpx 32rpx 0;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  .stat-num {
    font-size: 36rpx;
    font-weight: 700;
    color: #333;
  }

  .stat-label {
    font-size: 24rpx;
    color: #999;
    margin-top: 4rpx;
  }
}

/* Body */
.profile-body {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* Points Card */
.points-card {
  border: 2rpx solid #FFD54F;
  background: #FFFDF5;
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .points-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #333;
  }

  .points-arrow {
    font-size: 24rpx;
    color: #999;
  }
}

.points-grid {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.points-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;

  .points-icon {
    font-size: 44rpx;
  }

  .points-name {
    font-size: 26rpx;
    font-weight: 600;
    color: #333;
  }

  .points-desc {
    font-size: 20rpx;
    color: #F5A623;
  }
}

/* Orders */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .section-label {
    font-size: 30rpx;
    font-weight: 700;
    color: #333;
  }

  .section-arrow {
    font-size: 24rpx;
    color: #999;
  }
}

.order-grid {
  display: flex;
}

.order-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  position: relative;

  .order-icon {
    font-size: 44rpx;
  }

  .order-text {
    font-size: 22rpx;
    color: #666;
  }

  .order-badge {
    position: absolute;
    top: -4rpx;
    right: 16rpx;
    min-width: 32rpx;
    height: 32rpx;
    border-radius: 16rpx;
    background: #FF4444;
    color: #fff;
    font-size: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8rpx;
  }
}

/* Functions */
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.func-grid {
  display: flex;
  flex-wrap: wrap;
}

.func-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 28rpx;

  .func-icon {
    font-size: 44rpx;
  }

  .func-text {
    font-size: 24rpx;
    color: #666;
  }
}

/* Ad Banner */
.ad-banner {
  background: linear-gradient(135deg, #7C4DFF, #536DFE);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
}

.ad-content {
  .ad-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #fff;
    display: block;
  }

  .ad-desc {
    font-size: 24rpx;
    color: rgba(255,255,255,0.8);
    display: block;
    margin-top: 8rpx;
  }
}

.ad-btn {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #FFD54F;
  color: #333;
  font-size: 28rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
