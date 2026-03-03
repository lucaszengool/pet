<template>
  <view class="page-container home-page">
    <!-- Status Bar + Header -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="location" @click="handleLocation">
          <IconSymbol name="location" :size="32" color="#F5A623" />
          <text class="location-text">{{ city }}</text>
          <text class="location-arrow">▾</text>
        </view>
        <view class="search-bar" @click="goSearch">
          <IconSymbol name="search" :size="28" color="#999" />
          <text class="search-placeholder">爱它就上宠我吧</text>
        </view>
        <view class="header-scan">
          <IconSymbol name="camera" :size="36" color="#666" />
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="main-scroll" :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- Banner Carousel -->
      <view class="banner-section">
        <swiper class="banner-swiper" circular autoplay :interval="3000" indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#F5A623">
          <swiper-item v-for="(item, idx) in banners" :key="idx">
            <view class="banner-item" :style="{ background: item.bg }">
              <view class="banner-text">
                <text class="banner-title">{{ item.title }}</text>
                <text class="banner-desc">{{ item.desc }}</text>
                <view class="banner-btn">{{ item.btn }}</view>
              </view>
              <view class="banner-emoji"><IconSymbol :name="item.icon" :size="100" color="rgba(255,255,255,0.7)" /></view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- Quick Entry -->
      <view class="card quick-entry">
        <view class="entry-grid">
          <view
            v-for="(item, idx) in quickEntries"
            :key="idx"
            class="entry-item"
            @click="goEntry(item)"
          >
            <view class="entry-icon" :style="{ background: item.bg }">
              <IconSymbol :name="item.icon" :size="44" :color="item.color" />
            </view>
            <text class="entry-text">{{ item.text }}</text>
          </view>
        </view>
      </view>

      <!-- Notification Banner -->
      <view class="card notification-bar" @click="goNotification">
        <IconSymbol name="bell" :size="32" color="#F5A623" />
        <text class="noti-text">新用户注册即送50元优惠券，快来领取~</text>
        <text class="noti-arrow">去领取 ></text>
      </view>

      <!-- Hot Recommendations -->
      <view class="section-title"><IconSymbol name="fire" :size="32" color="#FF5722" /> 热门推荐</view>
      <scroll-view scroll-x class="hot-scroll">
        <view class="hot-list">
          <view v-for="(item, idx) in hotItems" :key="idx" class="hot-card" @click="goDetail(item)">
            <view class="hot-img" :style="{ background: item.bg }">
              <IconSymbol :name="item.icon" :size="72" :color="item.color" />
              <view v-if="item.tag" class="hot-tag">{{ item.tag }}</view>
            </view>
            <view class="hot-info">
              <text class="hot-name">{{ item.name }}</text>
              <text class="hot-desc">{{ item.desc }}</text>
              <view class="hot-bottom">
                <text class="hot-price">¥{{ item.price }}</text>
                <text class="hot-location">{{ item.location }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>

      <!-- Nearby Services -->
      <view class="section-title"><IconSymbol name="location" :size="32" color="#F5A623" /> 附近服务</view>
      <view class="service-list">
        <view v-for="(item, idx) in nearbyServices" :key="idx" class="card service-card" @click="goServiceDetail(item)">
          <view class="service-avatar" :style="{ background: item.bg }">
            <IconSymbol :name="item.icon" :size="48" :color="item.color" />
          </view>
          <view class="service-info">
            <view class="service-name-row">
              <text class="service-name">{{ item.name }}</text>
              <view v-if="item.verified" class="verified-badge">已认证</view>
            </view>
            <text class="service-type">{{ item.type }}</text>
            <view class="service-meta">
              <text class="service-rating"><IconSymbol name="star" :size="24" color="#F5A623" /> {{ item.rating }}</text>
              <text class="service-distance">{{ item.distance }}</text>
              <text class="service-price">¥{{ item.price }}起</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Pet Knowledge -->
      <view class="section-title"><IconSymbol name="book" :size="32" color="#5C6BC0" /> 养宠知识</view>
      <view class="knowledge-list">
        <view v-for="(item, idx) in knowledgeList" :key="idx" class="card knowledge-card" @click="goKnowledge(item)">
          <view class="knowledge-info">
            <text class="knowledge-title">{{ item.title }}</text>
            <text class="knowledge-summary">{{ item.summary }}</text>
            <view class="knowledge-meta">
              <text class="knowledge-author">{{ item.author }}</text>
              <text class="knowledge-time">{{ item.time }}</text>
              <text class="knowledge-views">{{ item.views }}阅读</text>
            </view>
          </view>
          <view class="knowledge-cover" :style="{ background: item.bg }">
            <IconSymbol :name="item.icon" :size="56" :color="item.color" />
          </view>
        </view>
      </view>

      <!-- Bottom Space -->
      <view style="height: 40rpx;"></view>
    </scroll-view>

    <!-- Tab Bar -->
    <TabBar :current="0" />

    <!-- Pet Profile Onboarding Prompt -->
    <view v-if="showOnboardingPrompt" class="onboarding-mask" @click="dismissOnboarding">
      <view class="onboarding-modal" @click.stop>
        <view class="modal-close" @click="dismissOnboarding">
          <text class="close-x">&times;</text>
        </view>
        <view class="modal-body">
          <view class="modal-illustration">
            <view class="illust-circle">
              <view class="illust-paw"></view>
            </view>
          </view>
          <text class="modal-text">当前是预览页面，是否登录后为自己的宠物创建档案</text>
        </view>
        <view class="modal-actions">
          <view class="modal-btn cancel" @click="dismissOnboarding">取消</view>
          <view class="modal-btn confirm" @click="startOnboarding">确认</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TabBar from '@/components/TabBar.vue'
import IconSymbol from '@/components/common/IconSymbol.vue'
import { usePetStore } from '@/stores/pet'

const petStore = usePetStore()
const statusBarHeight = ref(0)
const city = ref('北京')
const showOnboardingPrompt = ref(false)

// Get status bar height
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 44
  }
})

// Check onboarding on every show
onShow(() => {
  if (petStore.shouldShowOnboarding) {
    setTimeout(() => {
      showOnboardingPrompt.value = true
    }, 800)
  } else {
    showOnboardingPrompt.value = false
  }
})

const dismissOnboarding = () => {
  showOnboardingPrompt.value = false
  petStore.dismissOnboarding()
}

const startOnboarding = () => {
  showOnboardingPrompt.value = false
  uni.navigateTo({ url: '/pages/pet-profile-setup/index' })
}

const banners = ref([
  { title: '上门喂养服务', desc: '专业宠物保姆，安心出行', btn: '立即预约', icon: 'cat', bg: 'linear-gradient(135deg, #FFE082, #FFB74D)' },
  { title: '宠物医疗服务', desc: '专业兽医在线问诊', btn: '立即咨询', icon: 'medical', bg: 'linear-gradient(135deg, #A5D6A7, #66BB6A)' },
  { title: '宠物用品特卖', desc: '精选好物，低至5折', btn: '去逛逛', icon: 'cart', bg: 'linear-gradient(135deg, #90CAF9, #42A5F5)' },
])

const quickEntries = ref([
  { text: '宠物买卖', icon: 'paw', color: '#E65100', bg: '#FFF3E0', path: '/pages/category/index?type=pet' },
  { text: '医疗服务', icon: 'medical', color: '#2E7D32', bg: '#E8F5E9', path: '/pages/category/index?type=medical' },
  { text: '宠物美容', icon: 'scissors', color: '#C2185B', bg: '#FCE4EC', path: '/pages/category/index?type=grooming' },
  { text: '寄养托管', icon: 'house', color: '#1565C0', bg: '#E3F2FD', path: '/pages/category/index?type=boarding' },
  { text: '遛狗服务', icon: 'walk', color: '#7B1FA2', bg: '#F3E5F5', path: '/pages/category/index?type=walking' },
  { text: '上门喂养', icon: 'meat', color: '#E8941E', bg: '#FFF8E1', path: '/pages/category/index?type=feeding' },
  { text: '宠物训练', icon: 'graduation', color: '#00838F', bg: '#E0F7FA', path: '/pages/category/index?type=training' },
  { text: '宠物殡葬', icon: 'dove', color: '#5D4037', bg: '#EFEBE9', path: '/pages/category/index?type=funeral' },
  { text: '宠物托运', icon: 'airplane', color: '#283593', bg: '#E8EAF6', path: '/pages/category/index?type=transport' },
  { text: '用品商城', icon: 'cart', color: '#BF360C', bg: '#FBE9E7', path: '/pages/category/index?type=shop' },
])

const hotItems = ref([
  { name: '金毛幼犬', desc: '3个月 / 已打疫苗', price: '2800', icon: 'dog', color: '#E65100', bg: '#FFF3E0', location: '朝阳区', tag: '热门', type: 'pet' },
  { name: '英短蓝猫', desc: '2个月 / 纯种', price: '3500', icon: 'cat', color: '#1565C0', bg: '#E3F2FD', location: '海淀区', tag: '新上', type: 'pet' },
  { name: '柯基犬', desc: '4个月 / 健康保障', price: '4200', icon: 'dog', color: '#2E7D32', bg: '#E8F5E9', location: '西城区', tag: '', type: 'pet' },
  { name: '布偶猫', desc: '3个月 / 带证', price: '5800', icon: 'cat', color: '#C2185B', bg: '#FCE4EC', location: '东城区', tag: '推荐', type: 'pet' },
])

const nearbyServices = ref([
  { name: '宠爱有家宠物医院', type: '宠物医疗 · 疫苗接种 · 体检', rating: '4.9', distance: '1.2km', price: '58', icon: 'medical', color: '#2E7D32', bg: '#E8F5E9', verified: true },
  { name: '毛孩子美容工作室', type: '宠物美容 · 洗澡 · 造型', rating: '4.8', distance: '0.8km', price: '68', icon: 'scissors', color: '#C2185B', bg: '#FCE4EC', verified: true },
  { name: '小王遛狗服务', type: '遛狗 · 上门喂养', rating: '4.7', distance: '0.5km', price: '30', icon: 'walk', color: '#1565C0', bg: '#E3F2FD', verified: false },
  { name: '萌宠乐园寄养中心', type: '寄养托管 · 日托 · 长期', rating: '4.9', distance: '2.1km', price: '88', icon: 'house', color: '#E65100', bg: '#FFF3E0', verified: true },
])

const knowledgeList = ref([
  { title: '新手养猫必看：幼猫到家第一周指南', summary: '刚到家的小猫咪需要特别的关爱和照顾，这份指南帮你轻松度过第一周...', author: '宠物医生小李', time: '2小时前', views: '2.3k', icon: 'cat', color: '#E65100', bg: '#FFF3E0' },
  { title: '狗狗驱虫全攻略，体内外驱虫这样做', summary: '定期驱虫是养狗的基本功，不同年龄的狗狗驱虫频率也不同...', author: '养宠达人', time: '5小时前', views: '1.8k', icon: 'dog', color: '#2E7D32', bg: '#E8F5E9' },
  { title: '夏季宠物降温技巧，这5点要注意', summary: '炎炎夏日，宠物也需要防暑降温，以下5个技巧帮你的毛孩子安度夏天...', author: '宠物营养师', time: '1天前', views: '3.1k', icon: 'sun', color: '#1565C0', bg: '#E3F2FD' },
])

const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

const handleLocation = () => {
  uni.showToast({ title: '定位功能开发中', icon: 'none' })
}

const goEntry = (item: any) => {
  uni.navigateTo({ url: item.path || '/pages/category/index' })
}

const goDetail = (item: any) => {
  uni.navigateTo({ url: '/pages/pet-detail/index?id=1' })
}

const goServiceDetail = (item: any) => {
  uni.navigateTo({ url: '/pages/service-detail/index?id=1' })
}

const goKnowledge = (item: any) => {
  uni.showToast({ title: '文章详情开发中', icon: 'none' })
}

const goNotification = () => {
  uni.showToast({ title: '活动详情开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.home-page {
  background: #F5F5F5;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, #FFE082 0%, #FFF8E1 100%);
}

.header-content {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx;
  height: 88rpx;
}

.location {
  display: flex;
  align-items: center;
  margin-right: 16rpx;
  flex-shrink: 0;

  .location-icon {
    font-size: 32rpx;
  }

  .location-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin: 0 4rpx;
  }

  .location-arrow {
    font-size: 20rpx;
    color: #666;
  }
}

.search-bar {
  flex: 1;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;

  .search-icon {
    font-size: 28rpx;
    margin-right: 12rpx;
  }

  .search-placeholder {
    font-size: 26rpx;
    color: #999;
  }
}

.header-scan {
  margin-left: 16rpx;
  font-size: 36rpx;
  flex-shrink: 0;
}

/* Banner */
.banner-section {
  padding: 0 24rpx;
  margin-top: 16rpx;
}

.banner-swiper {
  height: 280rpx;
  border-radius: 24rpx;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx;
  box-sizing: border-box;
}

.banner-text {
  display: flex;
  flex-direction: column;

  .banner-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 12rpx;
  }

  .banner-desc {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .banner-btn {
    background: #fff;
    color: #F5A623;
    font-size: 24rpx;
    font-weight: 600;
    padding: 12rpx 32rpx;
    border-radius: 28rpx;
    display: inline-block;
    width: fit-content;
  }
}

.banner-emoji {
  font-size: 120rpx;
  opacity: 0.8;
}

/* Quick Entry */
.quick-entry {
  padding: 24rpx 16rpx;
}

.entry-grid {
  display: flex;
  flex-wrap: wrap;
}

.entry-item {
  width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}

.entry-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-bottom: 8rpx;
}

.entry-text {
  font-size: 22rpx;
  color: #666;
}

/* Notification */
.notification-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  margin-top: 0;

  .noti-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }

  .noti-text {
    flex: 1;
    font-size: 24rpx;
    color: #666;
  }

  .noti-arrow {
    font-size: 24rpx;
    color: #F5A623;
    font-weight: 600;
  }
}

/* Hot Recommendations */
.hot-scroll {
  white-space: nowrap;
  padding-left: 24rpx;
}

.hot-list {
  display: inline-flex;
  gap: 20rpx;
  padding-right: 24rpx;
}

.hot-card {
  display: inline-block;
  width: 280rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.hot-img {
  width: 280rpx;
  height: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .hot-emoji {
    font-size: 80rpx;
  }

  .hot-tag {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    background: #F5A623;
    color: #fff;
    font-size: 20rpx;
    padding: 4rpx 16rpx;
    border-radius: 12rpx;
  }
}

.hot-info {
  padding: 16rpx;

  .hot-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hot-desc {
    font-size: 22rpx;
    color: #999;
    display: block;
    margin-top: 6rpx;
  }

  .hot-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12rpx;

    .hot-price {
      font-size: 30rpx;
      color: #FF4444;
      font-weight: 700;
    }

    .hot-location {
      font-size: 20rpx;
      color: #999;
    }
  }
}

/* Nearby Services */
.service-card {
  display: flex;
  padding: 24rpx;
}

.service-avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.service-info {
  flex: 1;
  overflow: hidden;

  .service-name-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .service-name {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }

  .verified-badge {
    font-size: 20rpx;
    color: #F5A623;
    border: 1rpx solid #F5A623;
    padding: 2rpx 12rpx;
    border-radius: 8rpx;
  }

  .service-type {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
    display: block;
  }

  .service-meta {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-top: 12rpx;

    .service-rating {
      font-size: 24rpx;
      color: #F5A623;
    }

    .service-distance {
      font-size: 22rpx;
      color: #999;
    }

    .service-price {
      font-size: 26rpx;
      color: #FF4444;
      font-weight: 600;
    }
  }
}

/* Knowledge */
.knowledge-card {
  display: flex;
  padding: 24rpx;
}

.knowledge-info {
  flex: 1;
  margin-right: 20rpx;
  overflow: hidden;

  .knowledge-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .knowledge-summary {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .knowledge-meta {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-top: 12rpx;
    font-size: 22rpx;
    color: #bbb;
  }
}

.knowledge-cover {
  width: 160rpx;
  height: 120rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  flex-shrink: 0;
}

.main-scroll {
  height: 100vh;
}

/* Onboarding Modal */
.onboarding-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.onboarding-modal {
  width: 580rpx;
  background: #fff;
  border-radius: 28rpx;
  overflow: hidden;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16rpx;
  right: 20rpx;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.close-x {
  font-size: 44rpx;
  color: #ccc;
  line-height: 1;
}

.modal-body {
  padding: 60rpx 48rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-illustration {
  margin-bottom: 36rpx;
}

.illust-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFF8E1, #FFE082);
  display: flex;
  align-items: center;
  justify-content: center;
}

.illust-paw {
  width: 48rpx;
  height: 48rpx;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32rpx;
    height: 28rpx;
    border-radius: 50%;
    background: #D4A04A;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 4rpx;
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #D4A04A;
    box-shadow: 20rpx 0 0 #D4A04A, 10rpx -12rpx 0 #D4A04A;
  }
}

.modal-text {
  font-size: 30rpx;
  color: #333;
  text-align: center;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  border-top: 1rpx solid #F0F0F0;
}

.modal-btn {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;

  &.cancel {
    color: #999;
    border-right: 1rpx solid #F0F0F0;
  }

  &.confirm {
    color: #F5A623;
    font-weight: 600;
  }
}
</style>
