import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Lesson from '../views/Lesson.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lesson/:id',
    name: 'Lesson',
    component: Lesson
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 