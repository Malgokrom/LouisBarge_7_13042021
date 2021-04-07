import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/inscription',
        name: 'Inscription',
        component: function () {
            return import('../views/Inscription.vue');
        }
    },
    {
        path: '/publications',
        name: 'Publications',
        component: function () {
            return import('../views/Publications.vue');
        }
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: function () {
            return import('../views/NotFound.vue');
        }
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
