import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', name: 'Home', component: () => import('../views/home') },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/notFound') },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    next()
})

export default router
