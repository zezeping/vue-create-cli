import { createRouter, createWebHistory } from 'vue-router'
import { useDefine } from '@/utils/hooks/useRouterDefine'

const routes = [
  useDefine({ path: '/', name: 'Home', component: () => import('../views/home'), }),
  useDefine({ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/notFound'), }),
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  next()
})

export default router
