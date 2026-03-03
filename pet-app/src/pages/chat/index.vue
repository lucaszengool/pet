<template>
  <view class="chat-page">
    <scroll-view scroll-y class="chat-scroll" :scroll-into-view="scrollToId" scroll-with-animation>
      <view class="chat-list">
        <view v-for="(msg, idx) in messages" :key="idx" :id="'msg-' + idx" class="chat-item" :class="{ mine: msg.isMine }">
          <view v-if="!msg.isMine" class="chat-avatar" :style="{ background: '#E8F5E9' }">
            <IconSymbol name="medical" :size="32" color="#666" />
          </view>
          <view class="chat-bubble" :class="{ mine: msg.isMine }">
            <text v-if="msg.type === 'text'">{{ msg.content }}</text>
            <view v-if="msg.type === 'image'" class="chat-image">
              <IconSymbol name="image" :size="26" color="#999" /> <text>[图片消息]</text>
            </view>
            <view v-if="msg.type === 'service'" class="chat-service-card">
              <text class="service-card-title">{{ msg.serviceInfo?.name }}</text>
              <text class="service-card-price">¥{{ msg.serviceInfo?.price }}</text>
            </view>
          </view>
          <view v-if="msg.isMine" class="chat-avatar mine-avatar">
            <IconSymbol name="cat" :size="32" color="#F5A623" />
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Quick Actions -->
    <view class="quick-actions">
      <scroll-view scroll-x class="quick-scroll">
        <view class="quick-list">
          <view class="quick-btn" @click="sendQuick('你好，我想咨询一下服务')">你好，想咨询</view>
          <view class="quick-btn" @click="sendQuick('请问还有档期吗？')">有档期吗</view>
          <view class="quick-btn" @click="sendQuick('可以上门服务吗？')">可以上门吗</view>
          <view class="quick-btn" @click="sendQuick('价格可以优惠吗？')">价格优惠</view>
        </view>
      </scroll-view>
    </view>

    <!-- Input Bar -->
    <view class="input-bar">
      <view class="input-actions-left">
        <view class="input-action" @click="sendVoice"><IconSymbol name="mic" :size="40" color="#666" /></view>
      </view>
      <input
        class="chat-input"
        v-model="inputText"
        placeholder="输入消息..."
        confirm-type="send"
        @confirm="sendMessage"
      />
      <view class="input-actions-right">
        <view class="input-action" @click="sendImage"><IconSymbol name="image" :size="40" color="#666" /></view>
        <view class="send-btn" :class="{ active: inputText }" @click="sendMessage">
          <text>发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import IconSymbol from '@/components/common/IconSymbol.vue'

const inputText = ref('')
const scrollToId = ref('')
const chatName = ref('商家')

const messages = ref([
  { type: 'text', content: '您好！欢迎咨询，请问有什么可以帮您的？', isMine: false },
  { type: 'text', content: '你好，我想给猫咪预约疫苗接种', isMine: true },
  { type: 'text', content: '好的，我们目前有猫三联疫苗，进口的，120元/针，请问您的猫咪多大了？之前有打过疫苗吗？', isMine: false },
  { type: 'text', content: '3个月大，刚到家还没有打过', isMine: true },
  { type: 'text', content: '那建议先做一个基础体检，确认身体状况后再接种疫苗。我们有一个新手猫咪套餐，包含体检+首针疫苗，原价178元，套餐价只要138元。', isMine: false },
  { type: 'service', content: '', isMine: false, serviceInfo: { name: '新手猫咪体检+疫苗套餐', price: '138' } },
])

onLoad((options) => {
  if (options?.name) {
    chatName.value = options.name
    uni.setNavigationBarTitle({ title: options.name })
  }
})

const scrollToBottom = () => {
  nextTick(() => {
    scrollToId.value = 'msg-' + (messages.value.length - 1)
  })
}

onMounted(scrollToBottom)

const sendMessage = () => {
  if (!inputText.value.trim()) return
  messages.value.push({
    type: 'text',
    content: inputText.value,
    isMine: true
  })
  inputText.value = ''
  scrollToBottom()

  // Simulate auto reply
  setTimeout(() => {
    messages.value.push({
      type: 'text',
      content: '好的，收到您的消息，我会尽快回复您~',
      isMine: false
    })
    scrollToBottom()
  }, 1000)
}

const sendQuick = (text: string) => {
  inputText.value = text
  sendMessage()
}

const sendVoice = () => uni.showToast({ title: '语音功能开发中', icon: 'none' })
const sendImage = () => {
  uni.chooseImage({
    count: 1,
    success: () => {
      messages.value.push({ type: 'image', content: '', isMine: true })
      scrollToBottom()
    }
  })
}
</script>

<style lang="scss" scoped>
.chat-page { background: #F5F5F5; min-height: 100vh; display: flex; flex-direction: column; }
.chat-scroll { flex: 1; height: calc(100vh - 220rpx); }
.chat-list { padding: 20rpx 24rpx; padding-bottom: 240rpx; }
.chat-item { display: flex; align-items: flex-start; margin-bottom: 24rpx; &.mine { flex-direction: row-reverse; } }
.chat-avatar { width: 72rpx; height: 72rpx; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32rpx; flex-shrink: 0; margin: 0 12rpx; }
.mine-avatar { background: #FFF3E0 !important; }
.chat-bubble { max-width: 60%; padding: 20rpx 24rpx; border-radius: 20rpx; font-size: 28rpx; line-height: 1.5; color: #333; background: #fff; box-shadow: 0 1rpx 4rpx rgba(0,0,0,0.04); &.mine { background: linear-gradient(135deg, #FFE082, #FFD54F); color: #333; } }
.chat-image { font-size: 26rpx; color: #999; }
.chat-service-card { background: #f5f5f5; border-radius: 12rpx; padding: 16rpx; margin-top: 8rpx; .service-card-title { font-size: 26rpx; font-weight: 600; color: #333; display: block; } .service-card-price { font-size: 30rpx; color: #FF4444; font-weight: 700; display: block; margin-top: 4rpx; } }
.quick-actions { background: #fff; border-top: 1rpx solid #f0f0f0; }
.quick-scroll { white-space: nowrap; }
.quick-list { display: inline-flex; gap: 12rpx; padding: 12rpx 24rpx; }
.quick-btn { display: inline-block; padding: 10rpx 24rpx; background: #FFF8E1; color: #F5A623; border-radius: 24rpx; font-size: 24rpx; }
.input-bar { display: flex; align-items: center; padding: 16rpx 24rpx; background: #fff; border-top: 1rpx solid #f0f0f0; padding-bottom: calc(16rpx + env(safe-area-inset-bottom)); }
.input-actions-left { margin-right: 12rpx; }
.input-action { font-size: 40rpx; padding: 0 4rpx; }
.chat-input { flex: 1; height: 68rpx; background: #f5f5f5; border-radius: 34rpx; padding: 0 24rpx; font-size: 28rpx; }
.input-actions-right { display: flex; align-items: center; gap: 12rpx; margin-left: 12rpx; }
.send-btn { padding: 10rpx 24rpx; border-radius: 24rpx; background: #eee; color: #999; font-size: 26rpx; &.active { background: linear-gradient(135deg, #FFD54F, #F5A623); color: #fff; } }
</style>
