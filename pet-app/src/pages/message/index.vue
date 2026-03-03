<template>
  <view class="page-container message-page">
    <!-- Header -->
    <view class="msg-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="msg-header-content">
        <text class="msg-title">消息</text>
      </view>
      <!-- Tabs -->
      <view class="msg-tabs">
        <view
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="msg-tab"
          :class="{ active: currentTab === idx }"
          @click="currentTab = idx"
        >
          <text>{{ tab.name }}</text>
          <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
        </view>
      </view>
    </view>

    <view class="msg-body" :style="{ paddingTop: (statusBarHeight + 160) + 'px' }">
      <!-- Private Messages -->
      <view v-if="currentTab === 0" class="msg-list">
        <view v-for="(msg, idx) in privateMessages" :key="idx" class="msg-card" @click="goChat(msg)">
          <view class="msg-avatar" :style="{ background: msg.bg }">
            <IconSymbol :name="msg.icon" :size="40" color="#666" />
          </view>
          <view class="msg-info">
            <view class="msg-name-row">
              <text class="msg-name">{{ msg.name }}</text>
              <text class="msg-time">{{ msg.time }}</text>
            </view>
            <view class="msg-preview-row">
              <text class="msg-preview">{{ msg.lastMsg }}</text>
              <view v-if="msg.unread > 0" class="msg-unread">{{ msg.unread }}</view>
            </view>
          </view>
        </view>

        <view v-if="privateMessages.length === 0" class="empty-state">
          <view class="empty-emoji"><IconSymbol name="message" :size="80" color="#ccc" /></view>
          <text class="empty-text">暂无私信消息</text>
        </view>
      </view>

      <!-- System Notifications -->
      <view v-if="currentTab === 1" class="msg-list">
        <view v-for="(noti, idx) in systemNotifications" :key="idx" class="noti-card">
          <view class="noti-icon" :style="{ background: noti.bg }">
            <IconSymbol :name="noti.icon" :size="32" color="#666" />
          </view>
          <view class="noti-info">
            <text class="noti-title">{{ noti.title }}</text>
            <text class="noti-content">{{ noti.content }}</text>
            <text class="noti-time">{{ noti.time }}</text>
          </view>
        </view>

        <view v-if="systemNotifications.length === 0" class="empty-state">
          <view class="empty-emoji"><IconSymbol name="bell" :size="80" color="#ccc" /></view>
          <text class="empty-text">暂无系统通知</text>
        </view>
      </view>

      <!-- Comments & Replies -->
      <view v-if="currentTab === 2" class="msg-list">
        <view v-for="(comment, idx) in comments" :key="idx" class="comment-card">
          <view class="comment-avatar" :style="{ background: comment.bg }">
            <IconSymbol :name="comment.icon" :size="32" color="#666" />
          </view>
          <view class="comment-info">
            <view class="comment-header">
              <text class="comment-name">{{ comment.name }}</text>
              <text class="comment-action">{{ comment.action }}</text>
            </view>
            <text class="comment-content">{{ comment.content }}</text>
            <view class="comment-target">
              <text>{{ comment.target }}</text>
            </view>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
        </view>

        <view v-if="comments.length === 0" class="empty-state">
          <view class="empty-emoji"><IconSymbol name="memo" :size="80" color="#ccc" /></view>
          <text class="empty-text">暂无评论回复</text>
        </view>
      </view>
    </view>

    <TabBar :current="3" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TabBar from '@/components/TabBar.vue'
import IconSymbol from '@/components/common/IconSymbol.vue'

const statusBarHeight = ref(44)
uni.getSystemInfo({ success: (res) => { statusBarHeight.value = res.statusBarHeight || 44 } })

const currentTab = ref(0)
const tabs = ref([
  { name: '私信', count: 3 },
  { name: '通知', count: 2 },
  { name: '评论', count: 1 },
])

const privateMessages = ref([
  { name: '宠爱有家宠物医院', lastMsg: '您好，疫苗接种可以预约明天上午', time: '10:30', unread: 2, icon: 'medical', bg: '#E8F5E9' },
  { name: '小王遛狗服务', lastMsg: '好的，明天下午3点准时到', time: '昨天', unread: 1, icon: 'walk', bg: '#E3F2FD' },
  { name: '毛孩子美容', lastMsg: '造型做好了，您可以来接啦~', time: '前天', unread: 0, icon: 'scissors', bg: '#FCE4EC' },
  { name: '萌宠乐园', lastMsg: '寄养期间您的猫咪一切都好', time: '3天前', unread: 0, icon: 'house', bg: '#FFF3E0' },
])

const systemNotifications = ref([
  { title: '订单确认', content: '您的遛狗服务订单已被商家确认，服务时间：明天下午3:00', time: '2小时前', icon: 'check', bg: '#E8F5E9' },
  { title: '新用户奖励', content: '恭喜获得50元新人优惠券，快去使用吧！', time: '1天前', icon: 'celebrate', bg: '#FFF3E0' },
  { title: '服务评价提醒', content: '您的上门喂养服务已完成，快来评价吧', time: '2天前', icon: 'star', bg: '#FFF8E1' },
])

const comments = ref([
  { name: '养宠达人小李', action: '评论了你的发布', content: '这只金毛好可爱！还在吗？', target: '纯种金毛幼犬出售', time: '3小时前', icon: 'user', bg: '#E3F2FD' },
  { name: '猫奴日记', action: '回复了你', content: '好的谢谢，我下午来看看', target: '英短蓝猫出售', time: '5小时前', icon: 'user', bg: '#FCE4EC' },
])

const goChat = (msg: any) => {
  uni.navigateTo({ url: '/pages/chat/index?name=' + msg.name })
}
</script>

<style lang="scss" scoped>
.message-page {
  background: #F5F5F5;
}

.msg-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, #FFE082 0%, #FFF8E1 100%);
}

.msg-header-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}

.msg-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
}

.msg-tabs {
  display: flex;
  padding: 0 32rpx 16rpx;
  gap: 40rpx;
}

.msg-tab {
  font-size: 28rpx;
  color: #666;
  position: relative;
  padding-bottom: 12rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;

  &.active {
    color: #F5A623;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #F5A623;
      border-radius: 2rpx;
    }
  }
}

.tab-badge {
  min-width: 32rpx;
  height: 32rpx;
  border-radius: 16rpx;
  background: #FF4444;
  color: #fff;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
}

.msg-body {
  min-height: 100vh;
  padding-bottom: 140rpx;
}

.msg-list {
  padding: 16rpx 24rpx;
}

/* Private Messages */
.msg-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}

.msg-avatar {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.msg-info {
  flex: 1;
  overflow: hidden;
}

.msg-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.msg-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.msg-time {
  font-size: 22rpx;
  color: #ccc;
}

.msg-preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.msg-preview {
  font-size: 24rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.msg-unread {
  min-width: 36rpx;
  height: 36rpx;
  border-radius: 18rpx;
  background: #FF4444;
  color: #fff;
  font-size: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10rpx;
  margin-left: 12rpx;
}

/* Notifications */
.noti-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  margin-bottom: 16rpx;
}

.noti-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.noti-info {
  flex: 1;

  .noti-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: block;
  }

  .noti-content {
    font-size: 24rpx;
    color: #666;
    display: block;
    margin-top: 8rpx;
    line-height: 1.5;
  }

  .noti-time {
    font-size: 22rpx;
    color: #ccc;
    display: block;
    margin-top: 8rpx;
  }
}

/* Comments */
.comment-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  margin-bottom: 16rpx;
}

.comment-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
}

.comment-info {
  flex: 1;

  .comment-header {
    display: flex;
    gap: 8rpx;
    align-items: center;
  }

  .comment-name {
    font-size: 26rpx;
    font-weight: 600;
    color: #333;
  }

  .comment-action {
    font-size: 24rpx;
    color: #999;
  }

  .comment-content {
    font-size: 28rpx;
    color: #333;
    display: block;
    margin-top: 8rpx;
  }

  .comment-target {
    background: #F5F5F5;
    padding: 12rpx 16rpx;
    border-radius: 8rpx;
    margin-top: 12rpx;
    font-size: 24rpx;
    color: #999;
  }

  .comment-time {
    font-size: 22rpx;
    color: #ccc;
    display: block;
    margin-top: 8rpx;
  }
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-emoji {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #ccc;
  }
}
</style>
