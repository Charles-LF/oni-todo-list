<template>
    <div class="container">
        <h4>记你太美</h4>
        <!-- 底部信息 -->
        <span class="">
            <button @click="refish" class="clear-btn">
                刷新列表
            </button>
        </span>
        <!-- 项目展示 -->
        <ul class="things-list">
            <li v-for="thing in things" :key="thing.id" class="things-item">
                <div class="things-content">
                    <span>{{ thing.id + '.' + thing.things }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { send } from '@koishijs/client';
import { ref } from 'vue';

interface IThings {
    id: number
    things: string
}

const things = ref([]);

send('get-things').then((data: IThings[]) => {
    things.value = data;
});

function refish() {
    send('get-things').then((data: IThings[]) => {
        things.value = data;
    });
}
</script>

<style scoped>
.container {
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 任务列表样式 */
.things-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: calc(2 * (0.75rem * 2 + 1.25rem + 1px));
  /* 6行任务的高度 */
  overflow-y: auto;
  /* 添加垂直滚动条 */
  border: 1px solid var(--medium-gray);
  /* 添加边框 */
  border-radius: 0.375rem;
  /* 圆角 */
  padding: 0.5rem;
  /* 内边距 */
}

.things-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.5rem;
  /* 调整内边距 */
  margin-bottom: 0.25rem;
  /* 任务项间距 */
  border-radius: 0.25rem;
  /* 任务项圆角 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  /* 轻微阴影 */
  transition: all 0.2s ease;
  /* 过渡效果 */
}

.things-item:last-child {
  border-bottom: none;
}

.things-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  max-width: 80%;
}

.things-item:hover .delete-btn {
  opacity: 1;
}

/* 底部信息样式 */
.things-footer {
  /* display: flex; */
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid var(--medium-gray);
  font-size: 0.875rem;
}

.clear-btn {
  background: none;
  border: none;
  color: var(--secondary-color);
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #0056B3;
}

/* 自定义滚动条样式 */
.things-list::-webkit-scrollbar {
  width: 6px;
  /* 滚动条宽度 */
}

.things-list::-webkit-scrollbar-track {
  background: var(--light-gray);
  /* 滚动条轨道背景 */
  border-radius: 3px;
  /* 轨道圆角 */
}

.things-list::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  /* 滚动条颜色 */
  border-radius: 3px;
  /* 滚动条圆角 */
}

.things-list::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
  /* 滚动条悬停颜色 */
}
</style>