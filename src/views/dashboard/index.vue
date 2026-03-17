<script setup lang="ts">
import { useThemeBridge, type ThemeBridgePayload } from '@/composables/useTheme'

function handleClick() {
  throw new Error('测试错误')
}

const bridgeState = ref<ThemeBridgePayload | null>(null)

useThemeBridge((payload) => {
  bridgeState.value = payload
})
</script>

<template>
  <div class="dashboard-page">
    <ElButton type="primary" @click="handleClick">{{ $t('测试') }}</ElButton>
    <div>{{ $t('哈哈哈哈') }}</div>
    <h1>{{ $t('你好, 这是一个测试') }}</h1>

    <div class="bridge-grid">
      <div class="bridge-card" data-third-party="chart">
        <div class="bridge-title">图表组件桥接</div>
        <div class="chart-bars">
          <span
            v-for="(color, idx) in bridgeState?.chartPalette || []"
            :key="`${color}-${idx}`"
            class="bar"
            :style="{ backgroundColor: color, height: `${32 + idx * 10}px` }"
          />
        </div>
      </div>

      <div class="bridge-card" data-third-party="map">
        <div class="bridge-title">地图组件桥接</div>
        <div class="map-preview" :style="{ borderColor: bridgeState?.mapAccent }">
          <span>Map Accent: {{ bridgeState?.mapAccent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.bridge-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.bridge-card {
  padding: 14px;
  background: var(--va-thirdparty-surface);
  border: 1px solid var(--va-thirdparty-border);
  border-radius: 10px;
}

.bridge-title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--va-thirdparty-text);
}

.chart-bars {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  min-height: 82px;
}

.bar {
  display: inline-block;
  width: 24px;
  border-radius: 4px 4px 0 0;
}

.map-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 86px;
  font-size: 12px;
  color: var(--va-thirdparty-text);
  border: 1px solid;
  border-radius: 8px;
}
</style>
