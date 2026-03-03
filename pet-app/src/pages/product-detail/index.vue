<template>
  <view class="detail-page">
    <swiper class="detail-swiper" circular indicator-dots indicator-color="rgba(255,255,255,0.4)" indicator-active-color="#F5A623">
      <swiper-item v-for="(img, idx) in images" :key="idx">
        <view class="detail-img" :style="{ background: img.bg }">
          <view class="detail-emoji"><IconSymbol :name="img.icon" :size="140" color="#666" /></view>
        </view>
      </swiper-item>
    </swiper>

    <scroll-view scroll-y class="detail-scroll">
      <view class="card">
        <view class="price-row">
          <text class="price">¥{{ product.price }}</text>
          <text class="original-price">¥{{ product.originalPrice }}</text>
          <text class="discount">{{ product.discount }}折</text>
        </view>
        <text class="product-title">{{ product.title }}</text>
        <view class="sales-row">
          <text>已售 {{ product.sales }}</text>
          <text>库存 {{ product.stock }}</text>
        </view>
      </view>

      <!-- Specs -->
      <view class="card">
        <text class="card-title">规格选择</text>
        <view class="spec-options">
          <view
            v-for="(spec, idx) in product.specs"
            :key="idx"
            class="spec-item"
            :class="{ active: selectedSpec === idx }"
            @click="selectedSpec = idx"
          >
            <text>{{ spec.name }}</text>
          </view>
        </view>
      </view>

      <!-- Description -->
      <view class="card">
        <text class="card-title">商品详情</text>
        <text class="desc-text">{{ product.description }}</text>
      </view>

      <!-- Reviews -->
      <view class="card">
        <view class="review-header">
          <text class="card-title">商品评价 ({{ product.reviewCount }})</text>
          <text class="view-all">查看全部 ></text>
        </view>
        <view v-for="(review, idx) in reviews" :key="idx" class="review-item">
          <view class="review-user">
            <view class="review-avatar" :style="{ background: review.bg }">
              <IconSymbol :name="review.icon" :size="24" color="#666" />
            </view>
            <text class="review-name">{{ review.name }}</text>
            <view class="review-rating">
              <IconSymbol v-for="s in review.rating" :key="s" name="star" :size="20" color="#F5A623" />
            </view>
          </view>
          <text class="review-content">{{ review.content }}</text>
        </view>
      </view>

      <view style="height: 160rpx;"></view>
    </scroll-view>

    <!-- Bottom Bar -->
    <view class="action-bar">
      <view class="action-left">
        <view class="action-icon">
          <IconSymbol name="cart" :size="32" color="#666" />
          <text class="action-text">购物车</text>
          <view class="cart-badge">2</view>
        </view>
        <view class="action-icon" @click="toggleFav">
          <IconSymbol :name="isFav ? 'heart' : 'heart-outline'" :size="32" :color="isFav ? '#FF4444' : '#999'" />
          <text class="action-text">收藏</text>
        </view>
      </view>
      <view class="action-right">
        <button class="btn-cart" @click="addToCart">加入购物车</button>
        <button class="btn-buy" @click="buyNow">立即购买</button>
      </view>
    </view>

    <!-- Quantity Selector Modal -->
    <view v-if="showQuantity" class="modal-mask" @click="showQuantity = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ quantityAction === 'cart' ? '加入购物车' : '立即购买' }}</text>
          <text class="modal-close" @click="showQuantity = false">×</text>
        </view>
        <view class="quantity-body">
          <view class="selected-info">
            <text class="selected-spec">已选: {{ product.specs[selectedSpec]?.name }}</text>
            <text class="selected-price">¥{{ product.price }}</text>
          </view>
          <view class="quantity-row">
            <text>数量</text>
            <view class="quantity-control">
              <view class="qty-btn" @click="quantity > 1 && quantity--">-</view>
              <text class="qty-num">{{ quantity }}</text>
              <view class="qty-btn" @click="quantity++">+</view>
            </view>
          </view>
          <button class="confirm-btn" @click="confirmAction">
            {{ quantityAction === 'cart' ? '加入购物车' : '立即购买' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const isFav = ref(false)
const selectedSpec = ref(0)
const showQuantity = ref(false)
const quantityAction = ref('cart')
const quantity = ref(1)

const images = ref([
  { icon: 'fish', bg: '#FFF3E0' },
  { icon: 'cat', bg: '#E3F2FD' },
])

const product = ref({
  title: '皇家猫粮 成猫通用型 室内猫粮 2kg',
  price: '89',
  originalPrice: '128',
  discount: '7.0',
  sales: '2.3k',
  stock: 368,
  reviewCount: 156,
  specs: [
    { name: '2kg装' },
    { name: '4kg装' },
    { name: '10kg装' },
  ],
  description: '皇家猫粮专为室内成猫设计，富含优质蛋白质和膳食纤维，有助于维持理想体重。独特的营养配方支持消化健康和毛球排出，让您的猫咪保持活力和健康。适口性佳，猫咪爱吃，主人放心。',
})

const reviews = ref([
  { name: '猫咪爱吃', rating: 5, content: '猫咪很喜欢这款猫粮，吃得很开心，毛发也变得更有光泽了。', icon: 'user', bg: '#E3F2FD' },
  { name: '铲屎官', rating: 4, content: '性价比不错，猫咪接受度很高，回购了好几次。', icon: 'user', bg: '#E8F5E9' },
])

const toggleFav = () => {
  isFav.value = !isFav.value
  uni.showToast({ title: isFav.value ? '已收藏' : '取消收藏', icon: 'none' })
}

const addToCart = () => {
  quantityAction.value = 'cart'
  showQuantity.value = true
}

const buyNow = () => {
  quantityAction.value = 'buy'
  showQuantity.value = true
}

const confirmAction = () => {
  showQuantity.value = false
  if (quantityAction.value === 'cart') {
    uni.showToast({ title: '已加入购物车', icon: 'success' })
  } else {
    uni.showToast({ title: '订单提交成功', icon: 'success' })
  }
}
</script>

<style lang="scss" scoped>
.detail-page { background: #F5F5F5; min-height: 100vh; }
.detail-swiper { height: 500rpx; }
.detail-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; .detail-emoji { font-size: 140rpx; } }
.detail-scroll { height: calc(100vh - 500rpx); }
.card { background: #fff; border-radius: 20rpx; padding: 24rpx; margin: 16rpx 24rpx; }
.price-row { display: flex; align-items: baseline; gap: 12rpx; .price { font-size: 48rpx; font-weight: 700; color: #FF4444; } .original-price { font-size: 26rpx; color: #ccc; text-decoration: line-through; } .discount { font-size: 22rpx; color: #fff; background: #FF4444; padding: 4rpx 12rpx; border-radius: 8rpx; } }
.product-title { font-size: 32rpx; font-weight: 600; color: #333; display: block; margin-top: 16rpx; line-height: 1.4; }
.sales-row { display: flex; gap: 24rpx; margin-top: 12rpx; font-size: 24rpx; color: #999; }
.card-title { font-size: 30rpx; font-weight: 700; color: #333; display: block; margin-bottom: 16rpx; }
.spec-options { display: flex; flex-wrap: wrap; gap: 16rpx; }
.spec-item { padding: 12rpx 32rpx; border: 2rpx solid #eee; border-radius: 12rpx; font-size: 26rpx; color: #666; &.active { border-color: #F5A623; background: #FFF8E1; color: #F5A623; } }
.desc-text { font-size: 28rpx; color: #666; line-height: 1.8; }
.review-header { display: flex; justify-content: space-between; align-items: center; .view-all { font-size: 24rpx; color: #999; } }
.review-item { padding: 16rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.review-user { display: flex; align-items: center; gap: 12rpx; }
.review-avatar { width: 56rpx; height: 56rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24rpx; }
.review-name { font-size: 26rpx; color: #333; flex: 1; }
.review-rating { font-size: 20rpx; }
.review-content { font-size: 26rpx; color: #666; margin-top: 8rpx; display: block; line-height: 1.5; }
.action-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 100rpx; background: #fff; display: flex; align-items: center; padding: 0 24rpx; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.05); z-index: 100; }
.action-left { display: flex; gap: 28rpx; margin-right: 20rpx; }
.action-icon { display: flex; flex-direction: column; align-items: center; font-size: 32rpx; position: relative; .action-text { font-size: 20rpx; color: #999; } .cart-badge { position: absolute; top: -8rpx; right: -8rpx; min-width: 32rpx; height: 32rpx; border-radius: 16rpx; background: #FF4444; color: #fff; font-size: 20rpx; display: flex; align-items: center; justify-content: center; } }
.action-right { flex: 1; display: flex; gap: 0; button { flex: 1; height: 72rpx; font-size: 26rpx; font-weight: 600; display: flex; align-items: center; justify-content: center; padding: 0; margin: 0; border: none; &::after { border: none; } } .btn-cart { background: #FFF8E1; color: #F5A623; border-radius: 36rpx 0 0 36rpx; } .btn-buy { background: linear-gradient(135deg, #FFD54F, #F5A623); color: #fff; border-radius: 0 36rpx 36rpx 0; } }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: flex-end; }
.modal-content { background: #fff; border-radius: 24rpx 24rpx 0 0; width: 100%; padding-bottom: env(safe-area-inset-bottom); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 30rpx 32rpx; border-bottom: 1rpx solid #f5f5f5; }
.modal-title { font-size: 32rpx; font-weight: 600; }
.modal-close { font-size: 40rpx; color: #999; }
.quantity-body { padding: 24rpx 32rpx; }
.selected-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24rpx; .selected-spec { font-size: 28rpx; color: #666; } .selected-price { font-size: 36rpx; color: #FF4444; font-weight: 700; } }
.quantity-row { display: flex; justify-content: space-between; align-items: center; padding: 20rpx 0; }
.quantity-control { display: flex; align-items: center; gap: 24rpx; .qty-btn { width: 56rpx; height: 56rpx; border-radius: 50%; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 32rpx; color: #333; } .qty-num { font-size: 32rpx; font-weight: 600; min-width: 60rpx; text-align: center; } }
.confirm-btn { width: 100%; height: 88rpx; background: linear-gradient(135deg, #FFD54F, #F5A623); color: #fff; font-size: 30rpx; font-weight: 600; border-radius: 44rpx; border: none; margin-top: 32rpx; &::after { border: none; } }
</style>
