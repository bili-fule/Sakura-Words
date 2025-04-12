import type { Lesson, Category, Word } from '../types/lesson'

/**
 * 解析课程Markdown内容
 * @param content Markdown内容
 * @returns 课程对象
 */
export function parseLessonMarkdown(content: string): Lesson {
  const lines = content.split('\n')
  const lesson: Lesson = {
    id: '',
    type: '',
    name: '',
    categories: []
  }
  
  let currentCategory: Category | null = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // 跳过空行
    if (!line) continue
    
    // 解析标题
    if (line.startsWith('# ')) {
      const [type, name] = line.substring(2).split(' - ')
      lesson.type = type
      lesson.name = name
      lesson.id = `lesson${type.match(/\d+/)?.[0] || ''}`
      continue
    }
    
    // 解析分类
    if (line.startsWith('## ')) {
      // 保存上一个分类
      if (currentCategory) {
        lesson.categories.push(currentCategory)
      }
      
      // 创建新分类
      currentCategory = {
        name: line.substring(3),
        words: []
      }
      continue
    }
    
    // 解析单词
    if (currentCategory && line.includes(' - ')) {
      const [japanese, chinese] = line.split(' - ')
      currentCategory.words.push({
        japanese,
        chinese
      })
    }
    
    // 解析题目
    if (line.startsWith('### ')) {
      const exerciseType = line.substring(4).trim()
      const questions: string[] = []
      
      // 收集题目内容
      while (++i < lines.length) {
        const nextLine = lines[i].trim()
        if (nextLine.startsWith('### ') || nextLine.startsWith('## ') || nextLine.startsWith('# ')) {
          i--
          break
        }
        if (nextLine) {
          questions.push(nextLine.replace(/^- /, ''))
        }
      }
      
      lesson.exercises = lesson.exercises || []
      lesson.exercises.push({
        type: exerciseType,
        questions
      })
      continue
    }
  }
  
  // 添加最后一个分类
  if (currentCategory) {
    lesson.categories.push(currentCategory)
  }
  
  return lesson
}

/**
 * 加载课程数据
 * @param lessonId 课程ID
 * @returns 课程对象
 */
export async function loadLesson(lessonId: string): Promise<Lesson> {
  try {
    // 从Markdown文件加载课程内容
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