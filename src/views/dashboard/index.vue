<script lang="ts" setup>
import Panel from '@/components/Dashboard/Panel.vue'
import LineChart from '@/components/Dashboard/LineChart.vue'
import RaddarChart from '@/components/Dashboard/RaddarChart.vue'
import PieChart from '@/components/Dashboard/PieChart.vue'
import BarChart from '@/components/Dashboard/BarChart.vue'

const activePanel = ref(0)
</script>

<template>
  <div class="dashboard-container">
    <Panel v-model:active="activePanel" />
    <LineChart :active="activePanel" />
    <div class="mx-[12px] mt-[12px]">
      <ElRow :gutter="12">
        <ElCol :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper mb-[12px]">
            <RaddarChart />
          </div>
        </ElCol>
        <ElCol :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper mb-[12px]">
            <PieChart />
          </div>
        </ElCol>
        <ElCol :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper mb-[12px]">
            <BarChart />
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding-top: 12px;
}
</style>
