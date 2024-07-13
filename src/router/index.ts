import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import('../home/Home.vue')
        },{
            path: '/domain',
            name: 'domain',
            component: () => import('../domain/Domain.vue')
        },{
            path: '/weather',
            name: 'weather',
            component: () => import('../weather/Weather.vue')
        }
    ]
})

export default router;