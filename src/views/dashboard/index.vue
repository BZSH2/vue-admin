<script setup lang="ts">
import PageContainer from '@/components/PageContainer.vue'
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
  <PageContainer compact>
    <div class="dashboard-page">
      <ElButton type="primary" @click="handleClick">{{ $t('测试') }}</ElButton>
      <div class="dashboard-note">{{ $t('哈哈哈哈') }}</div>
      <h1 class="dashboard-title">{{ $t('你好, 这是一个测试') }}</h1>

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
  </PageContainer>
</template>

<style scoped lang="scss">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard-note {
  color: var(--el-text-color-regular);
}

.dashboard-title {
  margin: 0;
  font-size: clamp(32px, 6vw, 48px);
  line-height: 1.08;
  color: var(--el-text-color-primary);
  overflow-wrap: anywhere;
}

.bridge-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.bridge-card {
  min-width: 0;
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
  overflow-x: auto;
}

.bar {
  display: inline-block;
  flex-shrink: 0;
  width: 24px;
  border-radius: 4px 4px 0 0;
}

.map-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 86px;
  padding: 12px;
  font-size: 12px;
  color: var(--va-thirdparty-text);
  text-align: center;
  overflow-wrap: anywhere;
  border: 1px solid;
  border-radius: 8px;
}

@media (width <= 768px) {
  .dashboard-page {
    gap: 12px;
  }

  .dashboard-title {
    font-size: clamp(28px, 9vw, 38px);
  }

  .bridge-grid {
    grid-template-columns: 1fr;
  }
}
</style>
