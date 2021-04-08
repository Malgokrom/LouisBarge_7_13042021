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
        path: '/listemembres',
        name: 'ListeMembres',
        component: function () {
            return import('../views/ListeMembres.vue');
        }
    },
    {
        path: '/preferences',
        name: 'Preferences',
        component: function () {
            return import('../views/Preferences.vue');
        }
    },
    {
        path: '/membre/:id',
        name: 'Membre',
        component: function () {
            return import('../views/Membre.vue');
        }
    },
    {
        path: '/profil',
        name: 'Profil',
        component: function () {
            return import('../views/Profil.vue');
        }
    },
    {
        path: '/reglement',
        name: 'Reglement',
        component: function () {
            return import('../views/Reglement.vue');
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
