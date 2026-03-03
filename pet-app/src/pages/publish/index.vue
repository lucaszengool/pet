<template>
  <view class="page-container publish-page">
    <!-- Header -->
    <view class="pub-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="pub-header-content">
        <text class="pub-title">发布信息</text>
      </view>
    </view>

    <view class="pub-body" :style="{ paddingTop: (statusBarHeight + 88) + 'px' }">
      <!-- Type Selector -->
      <view v-if="!selectedType" class="type-selector">
        <text class="type-hint">请选择发布类型</text>
        <view class="type-grid">
          <view
            v-for="(item, idx) in publishTypes"
            :key="idx"
            class="type-card"
            @click="selectType(item)"
          >
            <view class="type-icon" :style="{ background: item.bg }">
              <IconSymbol :name="item.icon" :size="56" color="#fff" />
            </view>
            <text class="type-name">{{ item.name }}</text>
            <text class="type-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>

      <!-- Publish Form -->
      <view v-else class="pub-form">
        <view class="form-type-bar" @click="selectedType = ''">
          <IconSymbol :name="currentTypeInfo.icon" :size="28" color="#F5A623" /> <text>{{ currentTypeInfo.name }}</text>
          <text class="change-type">更换类型 ></text>
        </view>

        <!-- Title -->
        <view class="form-group">
          <text class="form-label">标题</text>
          <input class="form-input" v-model="form.title" placeholder="请输入标题（4-30字）" maxlength="30" />
        </view>

        <!-- Category (for pets) -->
        <view v-if="selectedType === 'pet'" class="form-group">
          <text class="form-label">宠物品种</text>
          <view class="form-picker" @click="showBreedPicker = true">
            <text :class="{ placeholder: !form.breed }">{{ form.breed || '请选择品种' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </view>

        <!-- Service Type -->
        <view v-if="selectedType === 'service'" class="form-group">
          <text class="form-label">服务类型</text>
          <view class="form-picker" @click="showServicePicker = true">
            <text :class="{ placeholder: !form.serviceType }">{{ form.serviceType || '请选择服务类型' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </view>

        <!-- Price -->
        <view class="form-group">
          <text class="form-label">价格</text>
          <view class="price-input-wrap">
            <text class="price-unit">¥</text>
            <input class="form-input price-input" v-model="form.price" type="digit" placeholder="请输入价格" />
            <view class="price-type">
              <text
                v-for="(pt, idx) in priceTypes"
                :key="idx"
                :class="{ active: form.priceType === pt }"
                @click="form.priceType = pt"
              >{{ pt }}</text>
            </view>
          </view>
        </view>

        <!-- Description -->
        <view class="form-group">
          <text class="form-label">详细描述</text>
          <textarea
            class="form-textarea"
            v-model="form.description"
            placeholder="详细描述信息，让感兴趣的人更了解你发布的内容..."
            :maxlength="500"
          />
          <text class="word-count">{{ form.description.length }}/500</text>
        </view>

        <!-- Images -->
        <view class="form-group">
          <text class="form-label">上传图片（最多9张）</text>
          <view class="image-grid">
            <view v-for="(img, idx) in form.images" :key="idx" class="image-item">
              <image :src="img" mode="aspectFill" class="preview-image" />
              <view class="image-delete" @click="removeImage(idx)">×</view>
            </view>
            <view v-if="form.images.length < 9" class="image-add" @click="chooseImage">
              <view class="add-icon"><IconSymbol name="camera" :size="48" color="#ccc" /></view>
              <text class="add-text">添加图片</text>
            </view>
          </view>
        </view>

        <!-- Contact -->
        <view class="form-group">
          <text class="form-label">联系方式</text>
          <input class="form-input" v-model="form.contact" placeholder="手机号/微信号" />
        </view>

        <!-- Location -->
        <view class="form-group">
          <text class="form-label">所在位置</text>
          <view class="form-picker" @click="chooseLocation">
            <text :class="{ placeholder: !form.location }">{{ form.location || '点击选择位置' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </view>

        <!-- Submit -->
        <view class="submit-section">
          <button class="submit-btn" @click="handleSubmit">发布</button>
        </view>
      </view>
    </view>

    <!-- Breed Picker Modal -->
    <view v-if="showBreedPicker" class="modal-mask" @click="showBreedPicker = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择品种</text>
          <text class="modal-close" @click="showBreedPicker = false">×</text>
        </view>
        <scroll-view scroll-y class="modal-scroll">
          <view
            v-for="(breed, idx) in breeds"
            :key="idx"
            class="modal-item"
            @click="selectBreed(breed)"
          >
            <text>{{ breed }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- Service Type Picker Modal -->
    <view v-if="showServicePicker" class="modal-mask" @click="showServicePicker = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">选择服务类型</text>
          <text class="modal-close" @click="showServicePicker = false">×</text>
        </view>
        <scroll-view scroll-y class="modal-scroll">
          <view
            v-for="(st, idx) in serviceTypes"
            :key="idx"
            class="modal-item"
            @click="selectServiceType(st)"
          >
            <text>{{ st }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <TabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import TabBar from '@/components/TabBar.vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const statusBarHeight = ref(44)
uni.getSystemInfo({ success: (res) => { statusBarHeight.value = res.statusBarHeight || 44 } })

const selectedType = ref('')
const showBreedPicker = ref(false)
const showServicePicker = ref(false)

const publishTypes = ref([
  { name: '卖宠物', icon: 'paw', desc: '出售/领养宠物', bg: 'linear-gradient(135deg, #FFE082, #FFB74D)', value: 'pet' },
  { name: '提供服务', icon: 'tools', desc: '提供宠物相关服务', bg: 'linear-gradient(135deg, #A5D6A7, #66BB6A)', value: 'service' },
  { name: '卖商品', icon: 'cart', desc: '出售宠物用品', bg: 'linear-gradient(135deg, #90CAF9, #42A5F5)', value: 'product' },
  { name: '求购/求服务', icon: 'speaker', desc: '发布需求信息', bg: 'linear-gradient(135deg, #CE93D8, #AB47BC)', value: 'demand' },
])

const currentTypeInfo = computed(() => {
  return publishTypes.value.find(t => t.value === selectedType.value) || publishTypes.value[0]
})

const form = reactive({
  title: '',
  breed: '',
  serviceType: '',
  price: '',
  priceType: '一口价',
  description: '',
  images: [] as string[],
  contact: '',
  location: ''
})

const priceTypes = ['一口价', '可议价', '面议']

const breeds = ['金毛', '拉布拉多', '柯基', '柴犬', '哈士奇', '泰迪', '比熊', '法斗', '英斗', '萨摩耶', '博美', '边牧', '英短', '美短', '布偶', '暹罗', '加菲', '橘猫', '蓝猫', '银渐层', '其他']

const serviceTypes = ['宠物医疗', '宠物美容', '宠物寄养', '遛狗服务', '上门喂养', '宠物训练', '宠物托运', '宠物殡葬', '其他']

const selectType = (item: any) => {
  selectedType.value = item.value
}

const selectBreed = (breed: string) => {
  form.breed = breed
  showBreedPicker.value = false
}

const selectServiceType = (st: string) => {
  form.serviceType = st
  showServicePicker.value = false
}

const chooseImage = () => {
  uni.chooseImage({
    count: 9 - form.images.length,
    success: (res) => {
      form.images.push(...res.tempFilePaths)
    }
  })
}

const removeImage = (idx: number) => {
  form.images.splice(idx, 1)
}

const chooseLocation = () => {
  // In H5 mode, use a simple prompt
  uni.showModal({
    title: '输入位置',
    editable: true,
    placeholderText: '例如：北京市朝阳区',
    success: (res) => {
      if (res.confirm && res.content) {
        form.location = res.content
      }
    }
  })
}

const handleSubmit = () => {
  if (!form.title) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  if (!form.description) {
    uni.showToast({ title: '请输入描述', icon: 'none' })
    return
  }
  uni.showToast({ title: '发布成功！', icon: 'success' })
  setTimeout(() => {
    uni.redirectTo({ url: '/pages/home/index' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.publish-page {
  background: #F5F5F5;
}

.pub-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, #FFE082 0%, #FFF8E1 100%);
}

.pub-header-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}

.pub-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.pub-body {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

/* Type Selector */
.type-selector {
  padding: 40rpx 24rpx;
}

.type-hint {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 32rpx;
  text-align: center;
}

.type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  justify-content: center;
}

.type-card {
  width: calc(50% - 12rpx);
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}

.type-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56rpx;
  margin-bottom: 16rpx;
}

.type-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.type-desc {
  font-size: 24rpx;
  color: #999;
}

/* Form */
.pub-form {
  padding: 0 24rpx;
}

.form-type-bar {
  background: #FFF8E1;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 28rpx;
  color: #F5A623;
  font-weight: 600;

  .change-type {
    font-size: 24rpx;
    color: #999;
    font-weight: 400;
  }
}

.form-group {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  height: 72rpx;
  border: 2rpx solid #EFEFEF;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  height: 240rpx;
  border: 2rpx solid #EFEFEF;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.word-count {
  font-size: 22rpx;
  color: #ccc;
  text-align: right;
  display: block;
  margin-top: 8rpx;
}

.form-picker {
  height: 72rpx;
  border: 2rpx solid #EFEFEF;
  border-radius: 12rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;

  .placeholder {
    color: #ccc;
  }

  .picker-arrow {
    color: #ccc;
  }
}

.price-input-wrap {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .price-unit {
    font-size: 32rpx;
    color: #FF4444;
    font-weight: 700;
  }

  .price-input {
    flex: 1;
  }

  .price-type {
    display: flex;
    gap: 8rpx;

    text {
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      font-size: 22rpx;
      background: #f5f5f5;
      color: #999;

      &.active {
        background: #FFF8E1;
        color: #F5A623;
      }
    }
  }
}

/* Image Upload */
.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.image-item {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;

  .preview-image {
    width: 100%;
    height: 100%;
  }

  .image-delete {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    width: 40rpx;
    height: 40rpx;
    background: rgba(0,0,0,0.5);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }
}

.image-add {
  width: 200rpx;
  height: 200rpx;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;

  .add-icon {
    font-size: 48rpx;
  }

  .add-text {
    font-size: 22rpx;
    color: #999;
  }
}

/* Submit */
.submit-section {
  padding: 32rpx 0;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #FFD54F, #F5A623);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Modal */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  width: 100%;
  max-height: 60vh;
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

.modal-scroll {
  max-height: 50vh;
}

.modal-item {
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
  font-size: 28rpx;
  color: #333;

  &:active {
    background: #FFF8E1;
  }
}
</style>
