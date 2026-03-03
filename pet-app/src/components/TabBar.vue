<template>
  <view class="tab-bar">
    <view
      v-for="(item, index) in tabs"
      :key="index"
      class="tab-item"
      :class="{ active: currentTab === index, 'publish-tab': index === 2 }"
      @click="switchTab(index)"
    >
      <view v-if="index === 2" class="publish-btn">
        <text class="publish-icon">+</text>
      </view>
      <template v-else>
        <view class="tab-icon">
          <IconSymbol
            :name="item.icon"
            :size="44"
            :color="currentTab === index ? '#F5A623' : '#B0B0B0'"
          />
        </view>
        <text class="tab-text">{{ item.text }}</text>
        <view v-if="item.badge && item.badge > 0" class="badge">{{ item.badge > 99 ? '99+' : item.badge }}</view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const props = defineProps<{
  current?: number
}>()

const currentTab = ref(props.current || 0)

watch(() => props.current, (val) => {
  if (val !== undefined) currentTab.value = val
})

const tabs = ref([
  { text: '首页', icon: 'home', path: '/pages/home/index', badge: 0 },
  { text: '分类', icon: 'category', path: '/pages/category/index', badge: 0 },
  { text: '发布', icon: 'plus', path: '/pages/publish/index', badge: 0 },
  { text: '消息', icon: 'message', path: '/pages/message/index', badge: 3 },
  { text: '我的', icon: 'profile', path: '/pages/profile/index', badge: 0 },
])

const switchTab = (index: number) => {
  if (currentTab.value === index) return
  currentTab.value = index
  uni.redirectTo({ url: tabs.value[index].path })
}
</script>

<style scoped lang="scss">
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -1rpx 12rpx rgba(0, 0, 0, 0.04);
  z-index: 999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  position: relative;
  padding: 10rpx 0;

  &.active .tab-text {
    color: #F5A623;
    font-weight: 500;
  }
}

.tab-icon {
  margin-bottom: 4rpx;
}

.tab-text {
  font-size: 22rpx;
  color: #999;
  line-height: 1.2;
}

.publish-tab {
  margin-top: -30rpx;
}

.publish-btn {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFD54F, #F5A623);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(245, 166, 35, 0.35);
}

.publish-icon {
  font-size: 56rpx;
  color: #fff;
  font-weight: 300;
  line-height: 1;
  margin-top: -4rpx;
}

.badge {
  position: absolute;
  top: 2rpx;
  right: 20rpx;
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  background: #FF4444;
  color: #fff;
  font-size: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}
</style>
