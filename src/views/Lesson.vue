<template>
  <div class="lesson">
    <div class="lesson-header card">
      <button class="btn btn-text" @click="goBack">
        <span class="back-arrow">←</span> 返回
      </button>
      <div class="lesson-info">
        <h2>{{ currentLesson?.type }} - {{ currentLesson?.name }}</h2>
        <div class="categories-list" v-if="currentLesson?.categories">
          <span 
            v-for="category in currentLesson.categories" 
            :key="category.name"
            class="category-tag"
          >
            {{ category.name }}
          </span>
        </div>
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          <span class="progress-text">{{ currentIndex + 1 }} / {{ totalWords }}</span>
        </div>
      </div>
    </div>

    <div v-if="currentWord && !showSummary" class="question-container card">
      <div class="word-container">
        <div class="japanese-word">{{ currentWord.japanese }}</div>
        <div class="word-category" v-if="currentWord.category">
          <span class="category-badge">{{ currentWord.category }}</span>
        </div>
      </div>
      
      <div class="options-container">
        <button
          v-for="option in currentOptions"
          :key="option"
          class="option-button"
          :class="{
            'correct': showAnswer && option === currentWord.meaning,
            'incorrect': showAnswer && selectedAnswer === option && option !== currentWord.meaning,
            'disabled': showAnswer
          }"
          @click="checkAnswer(option)"
          :disabled="showAnswer"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="showAnswer" class="feedback-container">
        <div class="feedback" :class="isCorrect ? 'correct' : 'incorrect'">
          {{ isCorrect ? '回答正确！' : '回答错误！正确答案是：' + currentWord.meaning }}
        </div>
        <button class="btn btn-primary next-button" @click="nextQuestion">
          {{ isLastQuestion ? '完成' : '下一题' }}
        </button>
      </div>
    </div>

    <div v-if="showSummary" class="summary-container card">
      <h2>练习完成！</h2>
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">总题数</span>
          <span class="stat-value">{{ totalWords }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">正确数</span>
          <span class="stat-value">{{ score }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">正确率</span>
          <span class="stat-value">{{ accuracy }}%</span>
        </div>
      </div>

      <div v-if="mistakesByCategory.length > 0" class="mistakes-list">
        <h3>需要复习的单词</h3>
        <div v-for="category in mistakesByCategory" :key="category.name" class="mistake-category">
          <h4 class="category-title">{{ category.name }}</h4>
          <div class="mistake-item card" v-for="mistake in category.mistakes" :key="mistake.word">
            <div class="mistake-word">{{ mistake.word }}</div>
            <div class="mistake-details">
              <div>正确答案：{{ mistake.correct }}</div>
              <div>你的答案：{{ mistake.selected }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-actions">
        <button class="btn btn-secondary" @click="restartLesson">重新练习</button>
        <button class="btn btn-primary" @click="goBack">返回目录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { loadLesson } from '../utils/lessonLoader'
import type { Lesson } from '../types/lesson'

const router = useRouter()
const route = useRoute()

// 状态
const currentIndex = ref(0)
const showAnswer = ref(false)
const selectedAnswer = ref<string | null>(null)
const isCorrect = ref(false)
const score = ref(0)
const mistakes = ref<Array<{word: string, correct: string, selected: string, category?: string}>>([])
const showSummary = ref(false)

// 从路由参数获取课程数据
const currentLesson = ref<Lesson | null>(null)
const words = ref<Array<{ japanese: string; meaning: string; category?: string }>>([])

// 在组件挂载时初始化数据
onMounted(async () => {
  const lessonId = route.params.id as string
  try {
    currentLesson.value = await loadLesson(lessonId)
    if (currentLesson.value) {
      // 将所有分类的单词合并到一个数组中
      const allWords: Array<{ japanese: string; meaning: string; category?: string }> = []
      currentLesson.value.categories.forEach(category => {
        category.words.forEach(word => {
          allWords.push({
            japanese: word.japanese,
            meaning: word.chinese,
            category: category.name
          })
        })
      })
      words.value = shuffleArray(allWords)
    }
  } catch (error) {
    console.error('加载课程失败:', error)
  }
})

// 计算属性
const currentWord = computed(() => words.value[currentIndex.value])
const totalWords = computed(() => words.value.length)
const progress = computed(() => ((currentIndex.value + 1) / totalWords.value) * 100)
const accuracy = computed(() => 
  ((score.value / totalWords.value) * 100).toFixed(1)
)
const isLastQuestion = computed(() => currentIndex.value === totalWords.value - 1)

// 按分类组织错误
const mistakesByCategory = computed(() => {
  const categoryMap = new Map<string, Array<{word: string, correct: string, selected: string}>>()
  
  mistakes.value.forEach(mistake => {
    const category = mistake.category || '未分类'
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category)?.push({
      word: mistake.word,
      correct: mistake.correct,
      selected: mistake.selected
    })
  })
  
  return Array.from(categoryMap.entries()).map(([name, mistakes]) => ({
    name,
    mistakes
  }))
})

// 生成当前问题的选项
const currentOptions = computed(() => {
  if (!currentWord.value) return []
  
  const options = [currentWord.value.meaning]
  const otherWords = words.value.filter(w => w.meaning !== currentWord.value.meaning)
  
  while (options.length < 4 && otherWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherWords.length)
    const randomWord = otherWords[randomIndex]
    if (!options.includes(randomWord.meaning)) {
      options.push(randomWord.meaning)
    }
  }
  
  return shuffleArray(options)
})

// 方法
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function checkAnswer(answer: string) {
  selectedAnswer.value = answer
  showAnswer.value = true
  isCorrect.value = answer === currentWord.value.meaning
  
  if (isCorrect.value) {
    score.value++
  } else {
    mistakes.value.push({
      word: currentWord.value.japanese,
      correct: currentWord.value.meaning,
      selected: answer,
      category: currentWord.value.category
    })
  }
}

function nextQuestion() {
  showAnswer.value = false
  selectedAnswer.value = null
  
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++
  } else {
    showSummary.value = true
  }
}

function restartLesson() {
  currentIndex.value = 0
  score.value = 0
  mistakes.value = []
  showAnswer.value = false
  selectedAnswer.value = null
  showSummary.value = false
  words.value = shuffleArray([...words.value])
}

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.lesson {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.lesson-header {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.btn-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-size: 1.1rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.back-arrow {
  font-size: 1.4rem;
}

.lesson-info h2 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.categories-list {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.category-tag {
  background: var(--light-gray);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color);
}

.progress-container {
  position: relative;
  height: 8px;
  background: var(--light-gray);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -1.5rem;
  font-size: 0.9rem;
  color: var(--text-color);
}

.question-container {
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.word-container {
  text-align: center;
  margin-bottom: 2rem;
}

.japanese-word {
  font-size: 3rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.word-category {
  margin-top: 1rem;
}

.category-badge {
  background: var(--light-gray);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-color);
}

.options-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-button {
  padding: 1.2rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: white;
  font-size: 1.1rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-button:hover:not(.disabled) {
  border-color: var(--primary-color);
  transform: translateY(-2px);
}

.option-button.correct {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.option-button.incorrect {
  background: #f44336;
  color: white;
  border-color: #f44336;
}

.option-button.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feedback-container {
  text-align: center;
  margin-top: 2rem;
}

.feedback {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
}

.feedback.correct {
  background: rgba(88, 204, 2, 0.1);
  color: var(--primary-color);
}

.feedback.incorrect {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.next-button {
  font-size: 1.1rem;
  padding: 0.8rem 2rem;
}

.summary-container {
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.summary-container h2 {
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  text-align: center;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--light-gray);
  border-radius: 12px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-color);
}

.mistakes-list {
  margin-top: 2rem;
}

.mistakes-list h3 {
  font-size: 1.5rem;
  color: #f44336;
  margin-bottom: 1.5rem;
}

.mistake-category {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.mistake-item {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.mistake-word {
  font-size: 1.4rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.mistake-details {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
}

.summary-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 3rem;
}

.summary-actions button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

@media (max-width: 600px) {
  .lesson {
    padding: 0.5rem;
  }

  .lesson-header {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .lesson-info h2 {
    font-size: 1.5rem;
  }

  .japanese-word {
    font-size: 2.5rem;
  }

  .options-container {
    grid-template-columns: 1fr;
  }

  .summary-stats {
    grid-template-columns: 1fr;
  }

  .summary-actions {
    flex-direction: column;
  }

  .summary-actions button {
    width: 100%;
  }
}
</style>