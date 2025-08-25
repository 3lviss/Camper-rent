import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

export function createAppRouter(history = createWebHistory()) {
  return createRouter({ history, routes })
}