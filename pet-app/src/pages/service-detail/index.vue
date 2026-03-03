<template>
  <view class="detail-page">
    <!-- Service Header Image -->
    <view class="service-header-img" :style="{ background: 'linear-gradient(135deg, #FFE082, #FFB74D)' }">
      <view class="service-header-emoji"><IconSymbol name="medical" :size="160" color="#fff" /></view>
    </view>

    <scroll-view scroll-y class="detail-scroll">
      <!-- Service Info -->
      <view class="card">
        <view class="service-name-row">
          <text class="service-name">{{ service.name }}</text>
          <view v-if="service.verified" class="verified">已认证</view>
        </view>
        <text class="service-type">{{ service.type }}</text>
        <view class="service-rating-row">
          <text class="rating"><IconSymbol name="star" :size="24" color="#F5A623" /> {{ service.rating }}</text>
          <text class="review-count">{{ service.reviewCount }}条评价</text>
          <text class="distance"><IconSymbol name="location" :size="24" color="#999" /> {{ service.distance }}</text>
        </view>
        <text class="service-address">{{ service.address }}</text>
      </view>

      <!-- Price List -->
      <view class="card">
        <text class="card-title">服务项目</text>
        <view class="price-list">
          <view v-for="(item, idx) in service.priceList" :key="idx" class="price-item">
            <view class="price-item-info">
              <text class="price-item-name">{{ item.name }}</text>
              <text class="price-item-desc">{{ item.desc }}</text>
            </view>
            <view class="price-item-right">
              <text class="price-item-price">¥{{ item.price }}</text>
              <view class="book-btn" @click="bookService(item)">预约</view>
            </view>
          </view>
        </view>
      </view>

      <!-- Service Introduction -->
      <view class="card">
        <text class="card-title">服务介绍</text>
        <text class="intro-text">{{ service.introduction }}</text>
      </view>

      <!-- Reviews -->
      <view class="card">
        <view class="review-header">
          <text class="card-title">用户评价 ({{ service.reviewCount }})</text>
          <text class="view-all">查看全部 ></text>
        </view>
        <view v-for="(review, idx) in reviews" :key="idx" class="review-item">
          <view class="review-user">
            <view class="review-avatar" :style="{ background: review.bg }">
              <IconSymbol :name="review.icon" :size="28" color="#666" />
            </view>
            <view class="review-user-info">
              <text class="review-name">{{ review.name }}</text>
              <view class="review-rating">
                <IconSymbol v-for="s in review.rating" :key="s" name="star" :size="20" color="#F5A623" />
              </view>
            </view>
            <text class="review-time">{{ review.time }}</text>
          </view>
          <text class="review-content">{{ review.content }}</text>
        </view>
      </view>

      <!-- Merchant Info -->
      <view class="card">
        <text class="card-title">商家信息</text>
        <view class="merchant-info">
          <view class="merchant-row">
            <text class="merchant-label">营业时间</text>
            <text class="merchant-value">{{ service.businessHours }}</text>
          </view>
          <view class="merchant-row">
            <text class="merchant-label">联系电话</text>
            <text class="merchant-value link">{{ service.phone }}</text>
          </view>
          <view class="merchant-row">
            <text class="merchant-label">详细地址</text>
            <text class="merchant-value">{{ service.address }}</text>
          </view>
        </view>
      </view>

      <view style="height: 160rpx;"></view>
    </scroll-view>

    <!-- Bottom Bar -->
    <view class="action-bar">
      <view class="action-left">
        <view class="action-icon" @click="callMerchant">
          <IconSymbol name="phone" :size="36" color="#999" />
          <text class="action-text">电话</text>
        </view>
        <view class="action-icon" @click="toggleFav">
          <IconSymbol :name="isFav ? 'heart' : 'heart-outline'" :size="36" :color="isFav ? '#FF4444' : '#999'" />
          <text class="action-text">收藏</text>
        </view>
      </view>
      <button class="book-main-btn" @click="showBookingModal = true">立即预约</button>
    </view>

    <!-- Booking Modal -->
    <view v-if="showBookingModal" class="modal-mask" @click="showBookingModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">预约服务</text>
          <text class="modal-close" @click="showBookingModal = false">×</text>
        </view>
        <view class="booking-form">
          <view class="form-group">
            <text class="form-label">选择服务</text>
            <view class="service-options">
              <view
                v-for="(item, idx) in service.priceList"
                :key="idx"
                class="service-option"
                :class="{ active: selectedService === idx }"
                @click="selectedService = idx"
              >
                <text>{{ item.name }} ¥{{ item.price }}</text>
              </view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">预约日期</text>
            <picker mode="date" @change="onDateChange">
              <view class="date-picker">
                <text>{{ bookingDate || '请选择日期' }}</text>
              </view>
            </picker>
          </view>
          <view class="form-group">
            <text class="form-label">预约时间</text>
            <view class="time-slots">
              <view
                v-for="(slot, idx) in timeSlots"
                :key="idx"
                class="time-slot"
                :class="{ active: selectedTime === idx }"
                @click="selectedTime = idx"
              >
                <text>{{ slot }}</text>
              </view>
            </view>
          </view>
          <view class="form-group">
            <text class="form-label">备注</text>
            <textarea class="form-textarea" v-model="bookingNote" placeholder="请输入备注信息（如宠物品种、特殊需求等）" />
          </view>
          <button class="submit-booking" @click="submitBooking">确认预约</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const isFav = ref(false)
const showBookingModal = ref(false)
const selectedService = ref(0)
const selectedTime = ref(-1)
const bookingDate = ref('')
const bookingNote = ref('')

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

const service = ref({
  name: '宠爱有家宠物医院',
  type: '宠物医疗 · 疫苗接种 · 体检 · 手术',
  rating: '4.9',
  reviewCount: 256,
  distance: '1.2km',
  address: '北京市朝阳区望京街道xx路168号',
  verified: true,
  businessHours: '09:00 - 21:00',
  phone: '010-88888888',
  introduction: '宠爱有家宠物医院是一家专业的综合性宠物医院，拥有先进的医疗设备和经验丰富的兽医团队。我们提供疫苗接种、体检、绝育手术、牙齿护理、皮肤病治疗等全方位的宠物医疗服务。医院环境整洁温馨，致力于为每一位毛孩子提供最专业的医疗照护。',
  priceList: [
    { name: '基础体检', desc: '包含身体检查、听诊、触诊', price: '58' },
    { name: '疫苗接种(猫三联)', desc: '进口疫苗，含注射费', price: '120' },
    { name: '疫苗接种(犬四联)', desc: '进口疫苗，含注射费', price: '138' },
    { name: '绝育手术(猫)', desc: '含术前检查、麻醉、手术', price: '580' },
    { name: '洁牙套餐', desc: '超声波洁牙+抛光', price: '388' },
  ]
})

const reviews = ref([
  { name: '猫奴小王', rating: 5, content: '带猫咪来打疫苗，医生很专业很耐心，猫咪全程很配合。环境也很干净，推荐！', time: '2天前', icon: 'user', bg: '#E3F2FD' },
  { name: '狗狗的主人', rating: 5, content: '体检很仔细，医生还给了很多养宠建议，价格也合理，会再来的。', time: '5天前', icon: 'user', bg: '#E8F5E9' },
  { name: '布偶妈妈', rating: 4, content: '整体不错，就是人有点多需要等一会儿，建议提前预约。', time: '1周前', icon: 'user', bg: '#FCE4EC' },
])

const toggleFav = () => {
  isFav.value = !isFav.value
  uni.showToast({ title: isFav.value ? '已收藏' : '取消收藏', icon: 'none' })
}

const callMerchant = () => uni.showToast({ title: '拨打: 010-88888888', icon: 'none' })

const bookService = (item: any) => {
  selectedService.value = service.value.priceList.indexOf(item)
  showBookingModal.value = true
}

const onDateChange = (e: any) => {
  bookingDate.value = e.detail.value
}

const submitBooking = () => {
  if (!bookingDate.value) {
    uni.showToast({ title: '请选择日期', icon: 'none' })
    return
  }
  if (selectedTime.value < 0) {
    uni.showToast({ title: '请选择时间', icon: 'none' })
    return
  }
  uni.showToast({ title: '预约成功！', icon: 'success' })
  showBookingModal.value = false
}
</script>

<style lang="scss" scoped>
.detail-page {
  background: #F5F5F5;
  min-height: 100vh;
}

.service-header-img {
  height: 400rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .service-header-emoji {
    font-size: 160rpx;
  }
}

.detail-scroll {
  height: calc(100vh - 400rpx);
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 16rpx 24rpx;
}

.service-name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.service-name {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.verified {
  font-size: 22rpx;
  color: #F5A623;
  border: 1rpx solid #F5A623;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.service-type {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 8rpx;
}

.service-rating-row {
  display: flex;
  gap: 20rpx;
  margin-top: 12rpx;
  font-size: 24rpx;

  .rating { color: #F5A623; font-weight: 600; }
  .review-count { color: #999; }
  .distance { color: #999; }
}

.service-address {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

/* Price List */
.price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.price-item-info {
  .price-item-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: block;
  }

  .price-item-desc {
    font-size: 22rpx;
    color: #999;
    display: block;
    margin-top: 4rpx;
  }
}

.price-item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;

  .price-item-price {
    font-size: 30rpx;
    color: #FF4444;
    font-weight: 700;
  }

  .book-btn {
    padding: 8rpx 24rpx;
    background: #FFF8E1;
    color: #F5A623;
    border-radius: 24rpx;
    font-size: 24rpx;
    font-weight: 600;
  }
}

.intro-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

/* Reviews */
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .view-all {
    font-size: 24rpx;
    color: #999;
  }
}

.review-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.review-user {
  display: flex;
  align-items: center;
}

.review-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 12rpx;
}

.review-user-info {
  flex: 1;

  .review-name {
    font-size: 26rpx;
    font-weight: 600;
    color: #333;
    display: block;
  }

  .review-rating {
    font-size: 20rpx;
  }
}

.review-time {
  font-size: 22rpx;
  color: #ccc;
}

.review-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  margin-top: 12rpx;
  display: block;
}

/* Merchant */
.merchant-row {
  display: flex;
  padding: 12rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  .merchant-label {
    width: 160rpx;
    font-size: 26rpx;
    color: #999;
  }

  .merchant-value {
    flex: 1;
    font-size: 26rpx;
    color: #333;

    &.link {
      color: #F5A623;
    }
  }
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

.book-main-btn {
  flex: 1;
  height: 72rpx;
  background: linear-gradient(135deg, #FFD54F, #F5A623);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 36rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    border: none;
  }
}

/* Modal */
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 80vh;
  padding-bottom: env(safe-area-inset-bottom);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 600;
}

.modal-close {
  font-size: 40rpx;
  color: #999;
}

.booking-form {
  padding: 24rpx 32rpx;
}

.form-group {
  margin-bottom: 24rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
}

.service-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.service-option {
  padding: 12rpx 20rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #666;

  &.active {
    border-color: #F5A623;
    background: #FFF8E1;
    color: #F5A623;
  }
}

.date-picker {
  height: 72rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #666;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.time-slot {
  padding: 12rpx 24rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;

  &.active {
    border-color: #F5A623;
    background: #FFF8E1;
    color: #F5A623;
  }
}

.form-textarea {
  width: 100%;
  height: 160rpx;
  border: 2rpx solid #eee;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 26rpx;
  box-sizing: border-box;
}

.submit-booking {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #FFD54F, #F5A623);
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  margin-top: 24rpx;

  &::after {
    border: none;
  }
}
</style>
