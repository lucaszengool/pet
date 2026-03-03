<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>

<style lang="scss">
@import './uni.scss';

page {
  background-color: #F5F5F5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: #333;
  box-sizing: border-box;
}

/* Global Utility Classes */
.page-container {
  padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 20rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #333;
  margin: 30rpx 24rpx 16rpx;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Theme Colors */
$primary: #F5A623;
$primary-light: #FFD54F;
$primary-bg: #FFF8E1;
$bg-warm: #FFFDF5;
</style>
