import type { Lesson, LessonList } from '../types/lesson'
import { parseLessonMarkdown } from './lessonParser'

/**
 * 加载课程数据
 * @param lessonId 课程ID
 * @returns 课程对象
 */
export async function loadLesson(lessonId: string): Promise<Lesson> {
  try {
    const response = await fetch(`/src/data/lessons/${lessonId}.md`)
    if (!response.ok) {
      throw new Error(`加载课程失败: ${response.statusText}`)
    }
    const content = await response.text()
    return parseLessonMarkdown(content)
  } catch (error) {
    console.error('加载课程失败:', error)
    throw error
  }
}

/**
 * 获取课程列表
 * @returns 课程列表
 */
export async function getLessonList(): Promise<LessonList[]> {
  try {
    const response = await fetch('/src/data/lessons/list.md')
    if (!response.ok) {
      throw new Error(`加载课程列表失败: ${response.statusText}`)
    }
    const content = await response.text()
    const lines = content.split('\n')
    const lessons: LessonList[] = []
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        const [title, description, type, wordCount] = line.substring(2).split(' | ')
        const [lessonNumber, name] = title.split(' - ')
        
        lessons.push({
          id: `lesson${lessonNumber.match(/\d+/)?.[0] || ''}`,
          type: type as 'vocabulary' | 'conversation' | 'business' | 'travel' | 'culture',
          name,
          description,
          wordCount: parseInt(wordCount) || 0
        })
      }
    }
    
    return lessons
  } catch (error) {
    console.error('加载课程列表失败:', error)
    throw error
  }
}

// 获取课程统计信息
export function getLessonStats(lesson: Lesson) {
  const totalWords = lesson.categories.reduce((sum, category) => sum + category.words.length, 0)
  const categoryStats = lesson.categories.map(category => ({
    name: category.name,
    wordCount: category.words.length
  }))

  return {
    totalWords,
    categoryStats
  }
} 