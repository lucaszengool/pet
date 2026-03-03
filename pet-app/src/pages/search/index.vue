<template>
  <view class="search-page">
    <!-- Search Header -->
    <view class="search-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="search-bar-row">
        <view class="search-input-wrap">
          <view class="search-icon"><IconSymbol name="search" :size="28" color="#999" /></view>
          <input
            class="search-input"
            v-model="keyword"
            placeholder="搜索宠物、服务、商品..."
            focus
            confirm-type="search"
            @confirm="doSearch"
          />
          <text v-if="keyword" class="clear-btn" @click="keyword = ''">×</text>
        </view>
        <text class="cancel-btn" @click="goBack">取消</text>
      </view>
    </view>

    <view class="search-body" :style="{ paddingTop: (statusBarHeight + 100) + 'px' }">
      <!-- Before Search: History & Hot -->
      <view v-if="!hasSearched">
        <!-- Search History -->
        <view v-if="searchHistory.length > 0" class="section">
          <view class="section-header">
            <text class="section-title">搜索历史</text>
            <text class="clear-history" @click="clearHistory"><IconSymbol name="trash" :size="24" color="#999" /> 清空</text>
          </view>
          <view class="tag-list">
            <view
              v-for="(item, idx) in searchHistory"
              :key="idx"
              class="search-tag"
              @click="searchFromTag(item)"
            >
              <text>{{ item }}</text>
            </view>
          </view>
        </view>

        <!-- Hot Searches -->
        <view class="section">
          <text class="section-title"><IconSymbol name="fire" :size="30" color="#FF4444" /> 热门搜索</text>
          <view class="hot-list">
            <view
              v-for="(item, idx) in hotSearches"
              :key="idx"
              class="hot-item"
              @click="searchFromTag(item.keyword)"
            >
              <text class="hot-rank" :class="{ top: idx < 3 }">{{ idx + 1 }}</text>
              <text class="hot-keyword">{{ item.keyword }}</text>
              <text v-if="item.tag" class="hot-tag" :style="{ background: item.tagBg, color: item.tagColor }">{{ item.tag }}</text>
            </view>
          </view>
        </view>

        <!-- Category Quick Access -->
        <view class="section">
          <text class="section-title"><IconSymbol name="folder" :size="30" color="#F5A623" /> 分类筛选</text>
          <view class="filter-tags">
            <view v-for="(cat, idx) in categories" :key="idx" class="filter-tag" @click="searchCategory(cat)">
              <IconSymbol :name="cat.icon" :size="26" color="#666" /> <text>{{ cat.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Search Results -->
      <view v-else class="results-section">
        <!-- Filter Bar -->
        <view class="filter-bar">
          <view
            v-for="(f, idx) in filters"
            :key="idx"
            class="filter-item"
            :class="{ active: currentFilter === idx }"
            @click="currentFilter = idx"
          >
            <text>{{ f }}</text>
          </view>
        </view>

        <!-- Results List -->
        <view class="results-list">
          <view v-for="(item, idx) in searchResults" :key="idx" class="result-card" @click="goDetail(item)">
            <view class="result-img" :style="{ background: item.bg }">
              <view class="result-emoji"><IconSymbol :name="item.icon" :size="64" color="#666" /></view>
            </view>
            <view class="result-info">
              <text class="result-title">{{ item.title }}</text>
              <text class="result-desc">{{ item.desc }}</text>
              <view class="result-bottom">
                <text class="result-price">¥{{ item.price }}</text>
                <text class="result-location"><IconSymbol name="location" :size="22" color="#999" /> {{ item.location }}</text>
              </view>
            </view>
          </view>
        </view>

        <view v-if="searchResults.length === 0" class="empty-state">
          <view class="empty-emoji"><IconSymbol name="search" :size="80" color="#ccc" /></view>
          <text class="empty-text">未找到相关结果</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const statusBarHeight = ref(44)
uni.getSystemInfo({ success: (res) => { statusBarHeight.value = res.statusBarHeight || 44 } })

const keyword = ref('')
const hasSearched = ref(false)
const currentFilter = ref(0)
const filters = ['综合', '最新', '价格↑', '价格↓', '距离']

const searchHistory = ref(['金毛', '上门喂养', '猫粮', '宠物美容'])

const hotSearches = ref([
  { keyword: '上门喂养', tag: '热', tagBg: '#FFEBEE', tagColor: '#FF4444' },
  { keyword: '金毛幼犬', tag: '新', tagBg: '#E3F2FD', tagColor: '#1976D2' },
  { keyword: '猫咪寄养', tag: '', tagBg: '', tagColor: '' },
  { keyword: '宠物疫苗', tag: '', tagBg: '', tagColor: '' },
  { keyword: '遛狗服务', tag: '热', tagBg: '#FFEBEE', tagColor: '#FF4444' },
  { keyword: '狗粮推荐', tag: '', tagBg: '', tagColor: '' },
  { keyword: '宠物美容', tag: '', tagBg: '', tagColor: '' },
  { keyword: '布偶猫', tag: '', tagBg: '', tagColor: '' },
])

const categories = ref([
  { name: '宠物买卖', icon: 'paw' },
  { name: '医疗服务', icon: 'medical' },
  { name: '宠物美容', icon: 'scissors' },
  { name: '寄养托管', icon: 'house' },
  { name: '上门喂养', icon: 'meat' },
  { name: '用品商城', icon: 'cart' },
])

const searchResults = ref([
  { title: '纯种金毛幼犬 3个月 已打疫苗', desc: '自家繁殖 健康保障 可上门看', price: '2800', location: '朝阳区', icon: 'dog', bg: '#FFF3E0', type: 'pet' },
  { title: '金毛专用狗粮 15kg大包装', desc: '适合大型犬 营养均衡', price: '198', location: '线上发货', icon: 'bone', bg: '#EFEBE9', type: 'product' },
  { title: '专业遛金毛服务 朝阳区', desc: '经验丰富 有爱心 日常遛狗', price: '50', location: '朝阳区', icon: 'walk', bg: '#E3F2FD', type: 'service' },
  { title: '金毛成犬 找新家', desc: '因搬家无法继续养 求好心人', price: '1000', location: '海淀区', icon: 'dog', bg: '#E8F5E9', type: 'pet' },
])

const doSearch = () => {
  if (!keyword.value.trim()) return
  hasSearched.value = true
  if (!searchHistory.value.includes(keyword.value)) {
    searchHistory.value.unshift(keyword.value)
    if (searchHistory.value.length > 10) searchHistory.value.pop()
  }
}

const searchFromTag = (tag: string) => {
  keyword.value = tag
  doSearch()
}

const searchCategory = (cat: any) => {
  keyword.value = cat.name
  doSearch()
}

const clearHistory = () => {
  searchHistory.value = []
}

const goBack = () => {
  uni.navigateBack()
}

const goDetail = (item: any) => {
  if (item.type === 'pet') uni.navigateTo({ url: '/pages/pet-detail/index?id=1' })
  else if (item.type === 'service') uni.navigateTo({ url: '/pages/service-detail/index?id=1' })
  else uni.navigateTo({ url: '/pages/product-detail/index?id=1' })
}
</script>

<style lang="scss" scoped>
.search-page { background: #F5F5F5; min-height: 100vh; }
.search-header { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #FFF8E1; }
.search-bar-row { display: flex; align-items: center; padding: 16rpx 24rpx; gap: 16rpx; }
.search-input-wrap { flex: 1; height: 68rpx; background: #fff; border-radius: 34rpx; display: flex; align-items: center; padding: 0 20rpx; .search-icon { font-size: 28rpx; margin-right: 8rpx; } .search-input { flex: 1; font-size: 28rpx; } .clear-btn { font-size: 32rpx; color: #ccc; padding: 0 8rpx; } }
.cancel-btn { font-size: 28rpx; color: #F5A623; flex-shrink: 0; }
.search-body { padding: 16rpx 24rpx; }
.section { margin-bottom: 32rpx; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.section-title { font-size: 30rpx; font-weight: 700; color: #333; }
.clear-history { font-size: 24rpx; color: #999; }
.tag-list { display: flex; flex-wrap: wrap; gap: 16rpx; }
.search-tag { padding: 12rpx 24rpx; background: #fff; border-radius: 24rpx; font-size: 26rpx; color: #666; }
.hot-list { background: #fff; border-radius: 16rpx; overflow: hidden; }
.hot-item { display: flex; align-items: center; padding: 24rpx; border-bottom: 1rpx solid #f8f8f8; gap: 16rpx; &:last-child { border-bottom: none; } }
.hot-rank { width: 40rpx; font-size: 28rpx; font-weight: 700; color: #ccc; text-align: center; &.top { color: #FF4444; } }
.hot-keyword { flex: 1; font-size: 28rpx; color: #333; }
.hot-tag { font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 8rpx; }
.filter-tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.filter-tag { padding: 16rpx 24rpx; background: #fff; border-radius: 16rpx; font-size: 26rpx; color: #666; }
.filter-bar { display: flex; background: #fff; border-radius: 16rpx; padding: 4rpx; margin-bottom: 16rpx; }
.filter-item { flex: 1; text-align: center; padding: 16rpx 0; font-size: 26rpx; color: #999; border-radius: 12rpx; &.active { background: #FFF8E1; color: #F5A623; font-weight: 600; } }
.result-card { background: #fff; border-radius: 16rpx; display: flex; padding: 20rpx; margin-bottom: 16rpx; }
.result-img { width: 180rpx; height: 180rpx; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-right: 20rpx; .result-emoji { font-size: 64rpx; } }
.result-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; .result-title { font-size: 28rpx; font-weight: 600; color: #333; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; } .result-desc { font-size: 24rpx; color: #999; } .result-bottom { display: flex; justify-content: space-between; align-items: center; .result-price { font-size: 32rpx; color: #FF4444; font-weight: 700; } .result-location { font-size: 22rpx; color: #999; } } }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 100rpx 0; .empty-emoji { font-size: 80rpx; margin-bottom: 16rpx; } .empty-text { font-size: 28rpx; color: #ccc; } }
</style>
