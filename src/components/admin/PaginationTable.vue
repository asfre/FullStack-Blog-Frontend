<template>
  <div class="pagination-table">
    <el-table :data="data" style="width: 100%" border v-bind="$attrs">
      <slot></slot>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive } from 'vue'

// 定义props
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  }
})

// 定义事件
const emit = defineEmits(['size-change', 'current-change'])

// 分页配置
const pagination = reactive({
  currentPage: props.currentPage,
  pageSize: props.pageSize,
  total: props.total
})

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  emit('size-change', size)
}

// 当前页码变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  emit('current-change', current)
}
</script>

<style scoped>
.pagination-table {
  width: 100%;
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pagination {
    justify-content: center;
  }
}
</style>