<template>
  <image
    class="icon-symbol"
    :src="svgDataUri"
    :style="{
      width: (size || 40) + 'rpx',
      height: (size || 40) + 'rpx',
    }"
    mode="aspectFit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIconSvg } from '@/utils/icons'

const props = defineProps<{
  name: string
  size?: number
  color?: string
}>()

const svgDataUri = computed(() => {
  const svg = getIconSvg(props.name, props.color || '#666')
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
})
</script>

<style scoped>
.icon-symbol {
  display: inline-block;
  flex-shrink: 0;
}
</style>
