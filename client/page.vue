<template>
  <k-layout>
    <k-card>
      <div class="todo-container">
        <!-- 新任务输入框 -->
        <div class="input-wrapper">
          <input v-model="newTodoText" @keyup.enter="addTodo" placeholder="托德到底什么时候才女装啊..." class="todo-input">
          <button @click="addTodo" class="add-btn">添加新任务</button>
        </div>
        <!-- 筛选完成的项目 -->
        <div class="filter-buttons">
          <button @click="filter = 'all'" :class="{ active: filter === 'all' }" class="filter-btn">全部</button>
          <button @click="filter = 'active'" :class="{ active: filter === 'active' }" class="filter-btn">进行中</button>
          <button @click="filter = 'completed'" :class="{ active: filter === 'completed' }"
            class="filter-btn">已完成</button>
        </div>

        <!-- 项目展示 -->
        <ul class="todo-list">
          <li v-for="todo in filteredTodos" :key="todo.id" class="todo-item">
            <div class="todo-content">
              <input type="checkbox" v-model="todo.completed" class="checkbox">
              <span :class="{ completed: todo.completed }">{{ todo.id + '.' + todo.title }}</span>
            </div>
            <button @click="deleteTodo(todo.id)" class="delete-btn">×</button>
          </li>
        </ul>

        <!-- 底部信息 -->
        <div class="todo-footer">
          <span>{{ remainingCount }} 个任务未完成</span>
          <button @click="clearCompleted" class="clear-btn">
            清除已完成
          </button>
        </div>

      </div>
    </k-card>
    <k-card>
      勉强能看，功能基本 没实现，去机器人端增删改查罢
    </k-card>

  </k-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { send } from '@koishijs/client';
interface Itodoitem {
  id: number
  title: string
  completed: boolean
}

const todos = ref([]);
send('get-todo-list').then((data: Itodoitem[]) => {
    todos.value = data;
  });
// 获取待办事项列表
function fetchTodos() {
  send('get-todo-list').then((data: Itodoitem[]) => {
    todos.value = data;
  });
}
const newTodoText = ref();
const filter = ref('all')

// 计算未完成的任务数量
const remainingCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

// 清除已完成
const clearCompleted = () => {
  todos.value = todos.value.filter(todo => !todo.completed)
  fetchTodos();
  window.alert('已清除所有已完成任务...骗你的，没做嘞，去机器人命令清除罢')
}

// 过滤待办事项
const filteredTodos = computed(() => {
  if (filter.value === 'active') {
    return todos.value.filter(todo => !todo.completed)
  } else if (filter.value === 'completed') {
    return todos.value.filter(todo => todo.completed)
  }
  return todos.value
})

// 添加新任务
function addTodo() {
  if (!newTodoText.value) return
  // 调用后端接口添加新任务
  send('add-todo-item').then(() => {
    // todo
    fetchTodos()
  })
  window.alert('新任务添加成功...骗你的，没做嘞，去机器人命令添加罢')
}
function deleteTodo(id) {
  fetchTodos();
  window.alert(`${id}`+'任务删除成功...骗你的，没做嘞，去机器人命令删除罢')
}
</script>

<style scoped>
/* 基础样式 */
/* 容器样式 */
.todo-container {
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 输入区域样式 */
.input-wrapper {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--medium-gray);
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  color: brown;
}

.add-btn {
  padding: 0.75rem 1.25rem;
  background-color: brown;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.add-btn:hover {
  background-color: #45a049;
}

/* 筛选按钮样式 */
.filter-buttons {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: var(--light-gray);
  border: 1px solid var(--medium-gray);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background-color: #E7F3FF;
  border-color: #B3D7FF;
  color: #004085;
}

/* 任务列表样式 */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: calc(6 * (0.75rem * 2 + 1.25rem + 1px)); /* 6行任务的高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
  border: 1px solid var(--medium-gray); /* 添加边框 */
  border-radius: 0.375rem; /* 圆角 */
  padding: 0.5rem; /* 内边距 */
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0.5rem; /* 调整内边距 */
  background-color: rgb(18, 17, 17); /* 添加背景色 */
  margin-bottom: 0.25rem; /* 任务项间距 */
  border-radius: 0.25rem; /* 任务项圆角 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
  transition: all 0.2s ease; /* 过渡效果 */
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.completed {
  text-decoration: line-through;
  color: #868E96;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.todo-item:hover .delete-btn {
  opacity: 1;
}

/* 底部信息样式 */
.todo-footer {
  display: flex;
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
.todo-list::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

.todo-list::-webkit-scrollbar-track {
  background: var(--light-gray); /* 滚动条轨道背景 */
  border-radius: 3px; /* 轨道圆角 */
}

.todo-list::-webkit-scrollbar-thumb {
  background: #c0c0c0; /* 滚动条颜色 */
  border-radius: 3px; /* 滚动条圆角 */
}

.todo-list::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0; /* 滚动条悬停颜色 */
}
</style>
