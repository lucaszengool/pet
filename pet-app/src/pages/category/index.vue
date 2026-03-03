<template>
  <view class="page-container category-page">
    <!-- Header -->
    <view class="cat-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="cat-header-content">
        <text class="cat-title">分类</text>
        <view class="cat-search" @click="goSearch">
          <IconSymbol name="search" :size="28" color="#999" />
          <text class="cat-search-text">搜索</text>
        </view>
      </view>
    </view>

    <view class="cat-body" :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- Left Sidebar -->
      <scroll-view scroll-y class="cat-sidebar">
        <view
          v-for="(cat, idx) in categories"
          :key="idx"
          class="sidebar-item"
          :class="{ active: currentCategory === idx }"
          @click="currentCategory = idx"
        >
          <view v-if="currentCategory === idx" class="sidebar-indicator"></view>
          <IconSymbol :name="cat.icon" :size="28" color="#F5A623" /> <text>{{ cat.name }}</text>
        </view>
      </scroll-view>

      <!-- Right Content -->
      <scroll-view scroll-y class="cat-content">
        <!-- Banner -->
        <view class="cat-banner" :style="{ background: categories[currentCategory]?.bannerBg }">
          <view class="cat-banner-emoji"><IconSymbol :name="categories[currentCategory]?.icon" :size="72" color="#fff" /></view>
          <view class="cat-banner-info">
            <text class="cat-banner-title">{{ categories[currentCategory]?.name }}</text>
            <text class="cat-banner-desc">{{ categories[currentCategory]?.desc }}</text>
          </view>
        </view>

        <!-- Sub Categories -->
        <view class="sub-grid">
          <view
            v-for="(sub, idx) in categories[currentCategory]?.children"
            :key="idx"
            class="sub-item"
            @click="goSubCategory(sub)"
          >
            <view class="sub-icon" :style="{ background: sub.bg }">
              <IconSymbol :name="sub.icon" :size="40" color="#666" />
            </view>
            <text class="sub-text">{{ sub.name }}</text>
          </view>
        </view>

        <!-- Hot Items in this category -->
        <view class="cat-section-title">热门推荐</view>
        <view class="cat-items">
          <view v-for="(item, idx) in hotInCategory" :key="idx" class="cat-item-card" @click="goItemDetail(item)">
            <view class="cat-item-img" :style="{ background: item.bg }">
              <view class="cat-item-emoji"><IconSymbol :name="item.icon" :size="64" color="#666" /></view>
            </view>
            <view class="cat-item-info">
              <text class="cat-item-name">{{ item.name }}</text>
              <text class="cat-item-desc">{{ item.desc }}</text>
              <text class="cat-item-price">¥{{ item.price }}</text>
            </view>
          </view>
        </view>

        <view style="height: 40rpx;"></view>
      </scroll-view>
    </view>

    <TabBar :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TabBar from '@/components/TabBar.vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const statusBarHeight = ref(44)
uni.getSystemInfo({ success: (res) => { statusBarHeight.value = res.statusBarHeight || 44 } })

const currentCategory = ref(0)

const categories = ref([
  {
    name: '宠物买卖', icon: 'paw', desc: '找到你心仪的毛孩子', bannerBg: 'linear-gradient(135deg, #FFE082, #FFB74D)',
    children: [
      { name: '猫咪', icon: 'cat', bg: '#FFF3E0' },
      { name: '狗狗', icon: 'dog', bg: '#E3F2FD' },
      { name: '小型犬', icon: 'dog', bg: '#FCE4EC' },
      { name: '大型犬', icon: 'walk', bg: '#E8F5E9' },
      { name: '异宠', icon: 'hamster', bg: '#F3E5F5' },
      { name: '水族', icon: 'fish', bg: '#E0F7FA' },
      { name: '鸟类', icon: 'bird', bg: '#FFF8E1' },
      { name: '领养', icon: 'heart', bg: '#FFEBEE' },
    ]
  },
  {
    name: '医疗服务', icon: 'medical', desc: '专业宠物医疗护理', bannerBg: 'linear-gradient(135deg, #A5D6A7, #66BB6A)',
    children: [
      { name: '疫苗接种', icon: 'syringe', bg: '#E8F5E9' },
      { name: '体检套餐', icon: 'stethoscope', bg: '#E3F2FD' },
      { name: '绝育手术', icon: 'medical', bg: '#FCE4EC' },
      { name: '牙齿护理', icon: 'tooth', bg: '#FFF3E0' },
      { name: '皮肤病', icon: 'microscope', bg: '#F3E5F5' },
      { name: '在线问诊', icon: 'phone', bg: '#E0F7FA' },
    ]
  },
  {
    name: '宠物美容', icon: 'scissors', desc: '让毛孩子美美哒', bannerBg: 'linear-gradient(135deg, #F48FB1, #E91E63)',
    children: [
      { name: '洗澡', icon: 'bath', bg: '#FCE4EC' },
      { name: '修剪造型', icon: 'scissors', bg: '#F3E5F5' },
      { name: 'SPA护理', icon: 'sparkle', bg: '#E3F2FD' },
      { name: '染色', icon: 'paint', bg: '#FFF3E0' },
      { name: '清洁护理', icon: 'broom', bg: '#E8F5E9' },
    ]
  },
  {
    name: '寄养托管', icon: 'house', desc: '安心出行的好选择', bannerBg: 'linear-gradient(135deg, #90CAF9, #42A5F5)',
    children: [
      { name: '家庭寄养', icon: 'house', bg: '#E3F2FD' },
      { name: '机构寄养', icon: 'building', bg: '#FFF3E0' },
      { name: '日托', icon: 'sun', bg: '#FFF8E1' },
      { name: '长期寄养', icon: 'calendar', bg: '#E8F5E9' },
    ]
  },
  {
    name: '遛狗/喂养', icon: 'walk', desc: '上门照顾您的爱宠', bannerBg: 'linear-gradient(135deg, #CE93D8, #AB47BC)',
    children: [
      { name: '遛狗', icon: 'walk', bg: '#F3E5F5' },
      { name: '上门喂养', icon: 'meat', bg: '#FFF3E0' },
      { name: '上门喂猫', icon: 'cat', bg: '#FCE4EC' },
      { name: '定期照看', icon: 'eye', bg: '#E3F2FD' },
    ]
  },
  {
    name: '宠物训练', icon: 'graduation', desc: '专业训犬服务', bannerBg: 'linear-gradient(135deg, #FFE082, #FFC107)',
    children: [
      { name: '基础训练', icon: 'book', bg: '#FFF8E1' },
      { name: '行为纠正', icon: 'target', bg: '#FFEBEE' },
      { name: '特技训练', icon: 'star-outline', bg: '#E3F2FD' },
      { name: '社会化训练', icon: 'handshake', bg: '#E8F5E9' },
    ]
  },
  {
    name: '宠物托运', icon: 'airplane', desc: '安全快捷的宠物运输', bannerBg: 'linear-gradient(135deg, #80CBC4, #26A69A)',
    children: [
      { name: '航空托运', icon: 'airplane', bg: '#E0F7FA' },
      { name: '陆运', icon: 'car', bg: '#FFF3E0' },
      { name: '同城接送', icon: 'car', bg: '#FFF8E1' },
    ]
  },
  {
    name: '宠物殡葬', icon: 'dove', desc: '给毛孩子最后的关爱', bannerBg: 'linear-gradient(135deg, #BCAAA4, #8D6E63)',
    children: [
      { name: '火化服务', icon: 'candle', bg: '#EFEBE9' },
      { name: '纪念服务', icon: 'rose', bg: '#FCE4EC' },
      { name: '树葬', icon: 'tree', bg: '#E8F5E9' },
    ]
  },
  {
    name: '用品商城', icon: 'cart', desc: '精选宠物好物', bannerBg: 'linear-gradient(135deg, #FFAB91, #FF5722)',
    children: [
      { name: '猫粮', icon: 'fish', bg: '#FFF3E0' },
      { name: '狗粮', icon: 'bone', bg: '#EFEBE9' },
      { name: '零食', icon: 'cookie', bg: '#FFF8E1' },
      { name: '玩具', icon: 'tennis', bg: '#E8F5E9' },
      { name: '日用品', icon: 'lotion', bg: '#E3F2FD' },
      { name: '保健品', icon: 'pill', bg: '#F3E5F5' },
    ]
  },
])

const hotInCategory = computed(() => {
  const items = [
    { name: '纯种金毛幼犬', desc: '3个月 已打2针', price: '2800', icon: 'dog', bg: '#FFF3E0' },
    { name: '英短蓝白猫', desc: '2个月 包健康', price: '3500', icon: 'cat', bg: '#E3F2FD' },
    { name: '柴犬宝宝', desc: '4个月 血统纯正', price: '5000', icon: 'dog', bg: '#E8F5E9' },
    { name: '蓝金渐层', desc: '3个月 带证书', price: '6800', icon: 'cat', bg: '#FCE4EC' },
  ]
  return items
})

const goSearch = () => uni.navigateTo({ url: '/pages/search/index' })
const goSubCategory = (sub: any) => uni.showToast({ title: `${sub.name}列表`, icon: 'none' })
const goItemDetail = (item: any) => uni.navigateTo({ url: '/pages/pet-detail/index?id=1' })
</script>

<style lang="scss" scoped>
.category-page {
  background: #F5F5F5;
}

.cat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, #FFE082 0%, #FFF8E1 100%);
}

.cat-header-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}

.cat-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.cat-search {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: rgba(255,255,255,0.7);
  padding: 12rpx 24rpx;
  border-radius: 28rpx;

  .cat-search-text {
    font-size: 26rpx;
    color: #999;
  }
}

.cat-body {
  display: flex;
  height: 100vh;
}

.cat-sidebar {
  width: 180rpx;
  background: #fff;
  height: 100%;
  flex-shrink: 0;
}

.sidebar-item {
  position: relative;
  padding: 28rpx 16rpx;
  font-size: 26rpx;
  color: #666;
  text-align: center;
  border-bottom: 1rpx solid #f5f5f5;

  &.active {
    color: #F5A623;
    font-weight: 600;
    background: #FFF8E1;
  }
}

.sidebar-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6rpx;
  height: 40rpx;
  background: #F5A623;
  border-radius: 0 3rpx 3rpx 0;
}

.cat-content {
  flex: 1;
  height: 100%;
  padding-bottom: 120rpx;
}

.cat-banner {
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
}

.cat-banner-emoji {
  font-size: 72rpx;
  margin-right: 20rpx;
}

.cat-banner-info {
  .cat-banner-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #fff;
    display: block;
  }

  .cat-banner-desc {
    font-size: 24rpx;
    color: rgba(255,255,255,0.8);
    display: block;
    margin-top: 8rpx;
  }
}

.sub-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 16rpx;
}

.sub-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}

.sub-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 8rpx;
}

.sub-text {
  font-size: 22rpx;
  color: #666;
}

.cat-section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  padding: 20rpx 20rpx 12rpx;
}

.cat-items {
  padding: 0 16rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.cat-item-card {
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.cat-item-img {
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .cat-item-emoji {
    font-size: 64rpx;
  }
}

.cat-item-info {
  padding: 12rpx 16rpx 16rpx;

  .cat-item-name {
    font-size: 26rpx;
    font-weight: 600;
    color: #333;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .cat-item-desc {
    font-size: 22rpx;
    color: #999;
    display: block;
    margin-top: 4rpx;
  }

  .cat-item-price {
    font-size: 28rpx;
    color: #FF4444;
    font-weight: 700;
    display: block;
    margin-top: 8rpx;
  }
}
</style>
