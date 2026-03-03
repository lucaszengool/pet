<template>
  <view class="order-page">
    <!-- Tabs -->
    <view class="order-tabs">
      <view
        v-for="(tab, idx) in tabs"
        :key="idx"
        class="order-tab"
        :class="{ active: currentTab === idx }"
        @click="currentTab = idx"
      >
        <text>{{ tab.name }}</text>
        <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
      </view>
    </view>

    <scroll-view scroll-y class="order-scroll">
      <view v-if="filteredOrders.length > 0" class="order-list">
        <view v-for="(order, idx) in filteredOrders" :key="idx" class="order-card">
          <view class="order-header">
            <view class="order-shop">
              <view class="shop-emoji"><IconSymbol :name="order.icon" :size="28" color="#666" /></view>
              <text class="shop-name">{{ order.shopName }}</text>
            </view>
            <text class="order-status" :style="{ color: statusColor(order.status) }">{{ statusText(order.status) }}</text>
          </view>
          <view class="order-body">
            <view class="order-img" :style="{ background: order.bg }">
              <IconSymbol :name="order.itemIcon" :size="56" color="#666" />
            </view>
            <view class="order-info">
              <text class="order-name">{{ order.itemName }}</text>
              <text class="order-desc">{{ order.itemDesc }}</text>
              <text class="order-time">{{ order.time }}</text>
            </view>
            <view class="order-price-col">
              <text class="order-price">¥{{ order.price }}</text>
              <text class="order-qty">x{{ order.qty }}</text>
            </view>
          </view>
          <view class="order-footer">
            <text class="order-total">合计: <text class="total-price">¥{{ order.total }}</text></text>
            <view class="order-actions">
              <view v-if="order.status === 'pending'" class="order-btn" @click="cancelOrder(order)">取消订单</view>
              <view v-if="order.status === 'pending'" class="order-btn primary" @click="payOrder(order)">去付款</view>
              <view v-if="order.status === 'completed'" class="order-btn primary" @click="reviewOrder(order)">去评价</view>
              <view v-if="order.status === 'serving'" class="order-btn" @click="contactShop(order)">联系商家</view>
              <view class="order-btn" @click="viewDetail(order)">查看详情</view>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <view class="empty-emoji"><IconSymbol name="package" :size="80" color="#ccc" /></view>
        <text class="empty-text">暂无订单</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import IconSymbol from '@/components/common/IconSymbol.vue'

const currentTab = ref(0)
const tabs = ref([
  { name: '全部', count: 0, status: 'all' },
  { name: '待付款', count: 1, status: 'pending' },
  { name: '待服务', count: 0, status: 'paid' },
  { name: '进行中', count: 1, status: 'serving' },
  { name: '待评价', count: 2, status: 'completed' },
])

onLoad((options) => {
  if (options?.tab) {
    const idx = tabs.value.findIndex(t => t.status === options.tab)
    if (idx >= 0) currentTab.value = idx
  }
})

const orders = ref([
  { id: '1', shopName: '宠爱有家宠物医院', icon: 'medical', itemName: '猫咪体检+疫苗套餐', itemDesc: '基础体检 + 猫三联疫苗', itemIcon: 'syringe', bg: '#E8F5E9', price: '138', qty: 1, total: '138', status: 'pending', time: '2024-01-15 14:30' },
  { id: '2', shopName: '毛孩子美容工作室', icon: 'scissors', itemName: '猫咪洗澡+造型', itemDesc: '洗澡 + 基础造型修剪', itemIcon: 'bath', bg: '#FCE4EC', price: '128', qty: 1, total: '128', status: 'serving', time: '2024-01-14 10:00' },
  { id: '3', shopName: '小王遛狗服务', icon: 'walk', itemName: '日常遛狗服务', itemDesc: '每次30分钟 朝阳区', itemIcon: 'walk', bg: '#E3F2FD', price: '50', qty: 3, total: '150', status: 'completed', time: '2024-01-12 16:00' },
  { id: '4', shopName: '萌宠乐园', icon: 'house', itemName: '猫咪寄养 3天', itemDesc: '独立房间 每日照片汇报', itemIcon: 'cat', bg: '#FFF3E0', price: '88', qty: 3, total: '264', status: 'completed', time: '2024-01-10 09:00' },
])

const filteredOrders = computed(() => {
  if (currentTab.value === 0) return orders.value
  const status = tabs.value[currentTab.value].status
  return orders.value.filter(o => o.status === status)
})

const statusText = (status: string) => {
  const map: Record<string, string> = { pending: '待付款', paid: '待服务', serving: '进行中', completed: '待评价', cancelled: '已取消' }
  return map[status] || status
}

const statusColor = (status: string) => {
  const map: Record<string, string> = { pending: '#FF4444', paid: '#F5A623', serving: '#1976D2', completed: '#4CAF50', cancelled: '#999' }
  return map[status] || '#999'
}

const cancelOrder = (order: any) => uni.showModal({ title: '确认取消？', success: (res) => { if (res.confirm) uni.showToast({ title: '已取消', icon: 'success' }) } })
const payOrder = (order: any) => uni.showToast({ title: '支付功能开发中', icon: 'none' })
const reviewOrder = (order: any) => uni.showToast({ title: '评价功能开发中', icon: 'none' })
const contactShop = (order: any) => uni.navigateTo({ url: '/pages/chat/index?name=' + order.shopName })
const viewDetail = (order: any) => uni.showToast({ title: '订单详情开发中', icon: 'none' })
</script>

<style lang="scss" scoped>
.order-page { background: #F5F5F5; min-height: 100vh; }
.order-tabs { display: flex; background: #fff; position: sticky; top: 0; z-index: 10; }
.order-tab { flex: 1; text-align: center; padding: 24rpx 0; font-size: 26rpx; color: #999; position: relative; display: flex; align-items: center; justify-content: center; gap: 6rpx; &.active { color: #F5A623; font-weight: 600; &::after { content: ''; position: absolute; bottom: 0; left: 30%; right: 30%; height: 4rpx; background: #F5A623; border-radius: 2rpx; } } }
.tab-badge { min-width: 32rpx; height: 32rpx; border-radius: 16rpx; background: #FF4444; color: #fff; font-size: 20rpx; display: flex; align-items: center; justify-content: center; padding: 0 8rpx; }
.order-scroll { height: calc(100vh - 80rpx); }
.order-list { padding: 16rpx 24rpx; }
.order-card { background: #fff; border-radius: 20rpx; margin-bottom: 20rpx; overflow: hidden; }
.order-header { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 24rpx; border-bottom: 1rpx solid #f5f5f5; }
.order-shop { display: flex; align-items: center; gap: 8rpx; .shop-emoji { font-size: 28rpx; } .shop-name { font-size: 28rpx; font-weight: 600; color: #333; } }
.order-status { font-size: 26rpx; font-weight: 600; }
.order-body { display: flex; padding: 20rpx 24rpx; }
.order-img { width: 140rpx; height: 140rpx; border-radius: 12rpx; display: flex; align-items: center; justify-content: center; font-size: 56rpx; flex-shrink: 0; margin-right: 20rpx; }
.order-info { flex: 1; .order-name { font-size: 28rpx; font-weight: 600; color: #333; display: block; } .order-desc { font-size: 24rpx; color: #999; display: block; margin-top: 6rpx; } .order-time { font-size: 22rpx; color: #ccc; display: block; margin-top: 8rpx; } }
.order-price-col { text-align: right; .order-price { font-size: 28rpx; color: #333; font-weight: 600; display: block; } .order-qty { font-size: 22rpx; color: #999; display: block; margin-top: 4rpx; } }
.order-footer { display: flex; justify-content: space-between; align-items: center; padding: 16rpx 24rpx; border-top: 1rpx solid #f5f5f5; }
.order-total { font-size: 24rpx; color: #999; .total-price { color: #FF4444; font-size: 30rpx; font-weight: 700; } }
.order-actions { display: flex; gap: 12rpx; }
.order-btn { padding: 10rpx 24rpx; border: 1rpx solid #ddd; border-radius: 24rpx; font-size: 24rpx; color: #666; &.primary { border-color: #F5A623; background: #FFF8E1; color: #F5A623; } }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 0; .empty-emoji { font-size: 80rpx; margin-bottom: 16rpx; } .empty-text { font-size: 28rpx; color: #ccc; } }
</style>
