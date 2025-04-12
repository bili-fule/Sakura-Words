/**
 * 单词类型定义
 */
export interface Word {
  /** 日语 */
  japanese: string
  /** 中文 */
  chinese: string
  note?: string
}

/**
 * 分类类型定义
 */
export interface Category {
  /** 分类名称 */
  name: string
  /** 该分类下的单词列表 */
  words: Word[]
}

/**
 * 课程类型定义
 */
export interface Lesson {
  /** 课程ID */
  id: string
  /** 课程类型（如：第28课） */
  type: string
  /** 课程名称 */
  name: string
  /** 课程分类列表 */
  categories: Category[]
}

// 课程列表类型
export interface LessonList {
  id: string
  name: string
  description: string
  wordCount: number
  type: 'vocabulary' | 'conversation' | 'business' | 'travel' | 'culture'
} 