<template>
  <div class="home">
    <header class="header">
      <h1>日语学习</h1>
      <p class="subtitle">通过游戏化方式学习日语</p>
    </header>

    <div class="stats-container card">
      <div class="stat-item">
        <span class="stat-value">{{ stats.totalLessons }}</span>
        <span class="stat-label">总课程数</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.totalWords }}</span>
        <span class="stat-label">总单词数</span>
      </div>
    </div>

    <div class="lessons-container">
      <h2>课程列表</h2>
      <div class="lessons-grid">
        <div 
          v-for="lesson in lessons" 
          :key="lesson.id"
          class="lesson-card card"
          @click="startLesson(lesson.id)"
        >
          <div class="lesson-info">
            <h3>{{ lesson.name }}</h3>
            <p>{{ lesson.description }}</p>
            <div class="lesson-meta">
              <span class="word-count">{{ lesson.wordCount }} 个单词</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLessonList } from '../utils/lessonLoader'
import type { LessonList } from '../types/lesson'

const router = useRouter()
const lessons = ref<LessonList[]>([])

// 模拟统计数据
const stats = ref({
  totalLessons: 0,
  totalWords: 0
})

// 获取课程图标
// 删除getLessonIcon函数，因为不再需要

// 加载课程列表
async function loadLessons() {
  try {
    lessons.value = await getLessonList()
    // 更新统计数据
    stats.value = {
      totalLessons: lessons.value.length,
      totalWords: lessons.value.reduce((sum, lesson) => sum + lesson.wordCount, 0)
    }
  } catch (error) {
    console.error('加载课程列表失败:', error)
  }
}

// 开始课程
function startLesson(lessonId: string) {
  router.push(`/lesson/${lessonId}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadLessons()
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  padding: 3rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.4rem;
  opacity: 0.9;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: -2rem auto 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--light-gray);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-item:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 6px 12px rgba(88, 204, 2, 0.1);
}

.stat-value {
  display: block;
  font-size: 3rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.8rem;
  line-height: 1;
}

.stat-label {
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 500;
}

.lessons-container {
  margin-top: 2rem;
}

.lessons-container h2 {
  margin-bottom: 2rem;
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.lesson-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
  height: 100%;
}

.lesson-card:hover {
  transform: translateY(-6px);
  border-color: var(--primary-color);
  box-shadow: 0 12px 24px rgba(88, 204, 2, 0.15);
}

.lesson-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lesson-info h3 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.lesson-info p {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  flex: 1;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: #666;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 2px solid var(--light-gray);
}

.word-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  .header {
    padding: 2rem 1rem;
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: -1rem 1rem 2rem;
    padding: 1.5rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-value {
    font-size: 2.5rem;
  }

  .lessons-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .lesson-card {
    padding: 1.5rem;
  }

  .lesson-info h3 {
    font-size: 1.3rem;
  }

  .lesson-info p {
    font-size: 1rem;
  }
}
</style>