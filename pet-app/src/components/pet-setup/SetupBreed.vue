<template>
  <view class="step-breed">
    <!-- Search bar -->
    <view class="search-wrap">
      <view class="search-bar">
        <text class="search-icon-text">&#x2315;</text>
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="点击搜索品种"
          @input="onSearchInput"
        />
      </view>
    </view>

    <scroll-view
      scroll-y
      class="breed-scroll"
      :scroll-into-view="scrollToId"
      scroll-with-animation
    >
      <!-- Hot breeds -->
      <view v-if="!searchQuery" class="hot-section">
        <text class="section-label">热门</text>
        <view class="hot-grid">
          <view
            v-for="item in hotBreeds"
            :key="item.name"
            class="hot-tag"
            :class="{ selected: selectedBreed === item.name }"
            @click="selectBreed(item.name)"
          >
            {{ item.name }}
          </view>
        </view>
      </view>

      <!-- Alphabetical list -->
      <view
        v-for="group in filteredGroups"
        :key="group.letter"
        :id="'breed-' + group.letter"
        class="breed-group"
      >
        <text class="group-letter">{{ group.letter }}</text>
        <view class="breed-list">
          <view
            v-for="item in group.breeds"
            :key="item.name"
            class="breed-item"
            :class="{ selected: selectedBreed === item.name }"
            @click="selectBreed(item.name)"
          >
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>

      <view style="height: 120rpx;"></view>
    </scroll-view>

    <!-- Right letter index -->
    <view v-if="!searchQuery" class="letter-index">
      <text
        class="letter-item active"
        @click="scrollToLetter('hot')"
      >热</text>
      <text
        v-for="letter in allLetters"
        :key="letter"
        class="letter-item"
        @click="scrollToLetter(letter)"
      >{{ letter }}</text>
    </view>

    <!-- Skip button -->
    <view class="skip-bar">
      <view class="skip-btn" @click="$emit('skip')">
        跳过（无合适品种）
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PetType } from '@/types/pet'
import { getHotBreeds, getBreedsByType, groupBreedsByLetter, searchBreeds } from '@/data/breeds'

const emit = defineEmits<{
  (e: 'next', data: { breed: string }): void
  (e: 'skip'): void
}>()

const props = defineProps<{
  data: Record<string, any>
}>()

const petType = computed(() => (props.data.type || 'dog') as PetType)
const searchQuery = ref('')
const selectedBreed = ref(props.data.breed || '')
const scrollToId = ref('')

const hotBreeds = computed(() => getHotBreeds(petType.value))

const filteredGroups = computed(() => {
  const breeds = searchQuery.value
    ? searchBreeds(petType.value, searchQuery.value)
    : getBreedsByType(petType.value)
  return groupBreedsByLetter(breeds)
})

const allLetters = computed(() => {
  const groups = groupBreedsByLetter(getBreedsByType(petType.value))
  return groups.map(g => g.letter)
})

const onSearchInput = (e: any) => {
  searchQuery.value = e.detail.value
}

const selectBreed = (name: string) => {
  selectedBreed.value = name
  emit('next', { breed: name })
}

const scrollToLetter = (letter: string) => {
  if (letter === 'hot') {
    scrollToId.value = ''
    setTimeout(() => { scrollToId.value = '' }, 10)
  } else {
    scrollToId.value = 'breed-' + letter
  }
}
</script>

<style lang="scss" scoped>
.step-breed {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.search-wrap {
  padding: 20rpx 32rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #F5F5F0;
  border-radius: 16rpx;
  padding: 0 24rpx;
  height: 80rpx;
}

.search-icon-text {
  font-size: 36rpx;
  color: #C4B998;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.breed-scroll {
  flex: 1;
  padding: 0 32rpx;
}

.hot-section {
  margin-bottom: 32rpx;
}

.section-label {
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.hot-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag {
  padding: 16rpx 28rpx;
  background: #F8F6F1;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid transparent;

  &.selected {
    background: #FFF8E1;
    color: #F5A623;
    border-color: #F5A623;
  }
}

.breed-group {
  margin-bottom: 16rpx;
}

.group-letter {
  font-size: 28rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.breed-list {
  background: #fff;
}

.breed-item {
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #F5F5F0;

  &:last-child {
    border-bottom: none;
  }

  &.selected {
    color: #F5A623;
    font-weight: 600;
  }
}

.letter-index {
  position: fixed;
  right: 8rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

.letter-item {
  font-size: 20rpx;
  color: #999;
  padding: 4rpx 8rpx;
  line-height: 1.4;

  &.active {
    color: #F5A623;
    font-weight: 700;
  }
}

.skip-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 20rpx 0 40rpx;
  background: linear-gradient(transparent, #fff 30%);
}

.skip-btn {
  font-size: 28rpx;
  color: #C4B998;
  padding: 16rpx 40rpx;
  background: #F5F5F0;
  border-radius: 32rpx;
}
</style>
