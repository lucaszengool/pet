<template>
  <view class="detail-page">
    <!-- Image Gallery -->
    <swiper class="detail-swiper" circular indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#F5A623">
      <swiper-item v-for="(img, idx) in images" :key="idx">
        <view class="detail-img" :style="{ background: img.bg }">
          <view class="detail-emoji"><IconSymbol :name="img.icon" :size="160" color="#666" /></view>
        </view>
      </swiper-item>
    </swiper>

    <scroll-view scroll-y class="detail-scroll">
      <!-- Price & Title -->
      <view class="card">
        <view class="price-row">
          <text class="price">¥{{ pet.price }}</text>
          <text class="price-tag">可议价</text>
        </view>
        <text class="detail-title">{{ pet.title }}</text>
        <view class="tag-row">
          <text class="tag" v-for="(tag, idx) in pet.tags" :key="idx">{{ tag }}</text>
        </view>
        <view class="meta-row">
          <text><IconSymbol name="location" :size="24" color="#999" /> {{ pet.location }}</text>
          <text><IconSymbol name="eye" :size="24" color="#999" /> {{ pet.views }}人浏览</text>
          <text><IconSymbol name="clock" :size="24" color="#999" /> {{ pet.time }}</text>
        </view>
      </view>

      <!-- Pet Info -->
      <view class="card">
        <text class="card-title">宠物信息</text>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">品种</text>
            <text class="info-value">{{ pet.breed }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">年龄</text>
            <text class="info-value">{{ pet.age }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">性别</text>
            <text class="info-value">{{ pet.gender }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">疫苗</text>
            <text class="info-value">{{ pet.vaccine }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">驱虫</text>
            <text class="info-value">{{ pet.deworming }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">绝育</text>
            <text class="info-value">{{ pet.sterilized }}</text>
          </view>
        </view>
      </view>

      <!-- Description -->
      <view class="card">
        <text class="card-title">详细描述</text>
        <text class="description">{{ pet.description }}</text>
      </view>

      <!-- Seller Info -->
      <view class="card seller-card">
        <view class="seller-info">
          <view class="seller-avatar">
            <IconSymbol name="user" :size="36" color="#F5A623" />
          </view>
          <view class="seller-detail">
            <text class="seller-name">{{ pet.seller.name }}</text>
            <view class="seller-meta">
              <text class="seller-badge" v-if="pet.seller.verified">已认证</text>
              <text>{{ pet.seller.publishCount }}条发布</text>
            </view>
          </view>
        </view>
        <view class="seller-btn" @click="goSellerHome">主页 ></view>
      </view>

      <!-- Similar Recommendations -->
      <view class="card">
        <text class="card-title">相似推荐</text>
        <scroll-view scroll-x class="similar-scroll">
          <view class="similar-list">
            <view v-for="(item, idx) in similarPets" :key="idx" class="similar-card" @click="goSimilar(item)">
              <view class="similar-img" :style="{ background: item.bg }">
                <IconSymbol :name="item.icon" :size="56" color="#666" />
              </view>
              <text class="similar-name">{{ item.name }}</text>
              <text class="similar-price">¥{{ item.price }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view style="height: 160rpx;"></view>
    </scroll-view>

    <!-- Bottom Action Bar -->
    <view class="action-bar">
      <view class="action-left">
        <view class="action-icon" @click="toggleFavorite">
          <IconSymbol :name="isFavorite ? 'heart' : 'heart-outline'" :size="36" :color="isFavorite ? '#FF4444' : '#999'" />
          <text class="action-text">收藏</text>
        </view>
        <view class="action-icon" @click="shareItem">
          <IconSymbol name="share" :size="36" color="#999" />
          <text class="action-text">分享</text>
        </view>
      </view>
      <view class="action-right">
        <button class="btn-call" @click="callSeller"><IconSymbol name="phone" :size="26" color="#F5A623" /> 电话咨询</button>
        <button class="btn-chat" @click="chatSeller"><IconSymbol name="message" :size="26" color="#fff" /> 在线咨询</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const isFavorite = ref(false)

const images = ref([
  { icon: 'dog', bg: '#FFF3E0' },
  { icon: 'dog', bg: '#E3F2FD' },
  { icon: 'walk', bg: '#E8F5E9' },
])

const pet = ref({
  title: '纯种金毛幼犬 已打疫苗 健康保障',
  price: '2800',
  location: '北京市朝阳区',
  views: 326,
  time: '2小时前发布',
  tags: ['纯种', '已打疫苗', '健康保障', '可上门看'],
  breed: '金毛寻回犬',
  age: '3个月',
  gender: '公',
  vaccine: '已打2针',
  deworming: '已驱虫',
  sterilized: '未绝育',
  description: '自家繁殖的纯种金毛幼犬，父母都是冠军血统，性格温顺，聪明活泼。已完成两次疫苗接种和体内外驱虫。小狗健康状况良好，可以上门看狗，也可以视频看狗。购买后提供售后健康保障，有任何问题随时联系。',
  seller: {
    name: '金毛之家',
    verified: true,
    publishCount: 12
  }
})

const similarPets = ref([
  { name: '拉布拉多', price: '3000', icon: 'dog', bg: '#E3F2FD' },
  { name: '柯基犬', price: '4200', icon: 'dog', bg: '#E8F5E9' },
  { name: '萨摩耶', price: '3500', icon: 'dog', bg: '#FCE4EC' },
  { name: '哈士奇', price: '2500', icon: 'dog', bg: '#F3E5F5' },
])

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  uni.showToast({ title: isFavorite.value ? '已收藏' : '取消收藏', icon: 'none' })
}

const shareItem = () => uni.showToast({ title: '分享功能开发中', icon: 'none' })
const callSeller = () => uni.showToast({ title: '电话咨询: 138xxxx8888', icon: 'none' })
const chatSeller = () => uni.navigateTo({ url: '/pages/chat/index?name=金毛之家' })
const goSellerHome = () => uni.showToast({ title: '卖家主页开发中', icon: 'none' })
const goSimilar = (item: any) => uni.showToast({ title: `查看${item.name}`, icon: 'none' })
</script>

<style lang="scss" scoped>
.detail-page {
  background: #F5F5F5;
  min-height: 100vh;
}

.detail-swiper {
  height: 560rpx;
}

.detail-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .detail-emoji {
    font-size: 160rpx;
  }
}

.detail-scroll {
  height: calc(100vh - 560rpx);
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 16rpx 24rpx;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .price {
    font-size: 48rpx;
    font-weight: 700;
    color: #FF4444;
  }

  .price-tag {
    font-size: 22rpx;
    color: #F5A623;
    border: 1rpx solid #F5A623;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
  }
}

.detail-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
  margin-top: 16rpx;
  display: block;
  line-height: 1.4;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;

  .tag {
    font-size: 22rpx;
    color: #F5A623;
    background: #FFF8E1;
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
  }
}

.meta-row {
  display: flex;
  gap: 24rpx;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: #999;
}

/* Info Grid */
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
}

.info-item {
  width: 33.33%;
  padding: 12rpx 0;

  .info-label {
    font-size: 24rpx;
    color: #999;
    display: block;
  }

  .info-value {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-top: 4rpx;
  }
}

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

/* Seller */
.seller-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.seller-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #FFF3E0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.seller-detail {
  .seller-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: block;
  }

  .seller-meta {
    display: flex;
    gap: 12rpx;
    margin-top: 4rpx;
    font-size: 22rpx;
    color: #999;
  }

  .seller-badge {
    color: #F5A623;
    border: 1rpx solid #F5A623;
    padding: 0 8rpx;
    border-radius: 4rpx;
  }
}

.seller-btn {
  font-size: 26rpx;
  color: #F5A623;
}

/* Similar */
.similar-scroll {
  white-space: nowrap;
}

.similar-list {
  display: inline-flex;
  gap: 16rpx;
}

.similar-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
}

.similar-img {
  width: 180rpx;
  height: 140rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
}

.similar-name {
  font-size: 24rpx;
  color: #333;
  margin-top: 8rpx;
}

.similar-price {
  font-size: 26rpx;
  color: #FF4444;
  font-weight: 600;
}

/* Action Bar */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.05);
  z-index: 100;
}

.action-left {
  display: flex;
  gap: 32rpx;
  margin-right: 24rpx;
}

.action-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 36rpx;

  .action-text {
    font-size: 20rpx;
    color: #999;
  }
}

.action-right {
  flex: 1;
  display: flex;
  gap: 16rpx;

  button {
    flex: 1;
    height: 72rpx;
    border-radius: 36rpx;
    font-size: 26rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    border: none;

    &::after {
      border: none;
    }
  }

  .btn-call {
    background: #FFF8E1;
    color: #F5A623;
  }

  .btn-chat {
    background: linear-gradient(135deg, #FFD54F, #F5A623);
    color: #fff;
  }
}
</style>
