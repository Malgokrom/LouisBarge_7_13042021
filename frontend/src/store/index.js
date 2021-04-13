import { createStore } from 'vuex';

export default createStore({
    state: {
        date_mise_en_service: '2021-01-01',
        url_api: 'http://localhost:3000/api',
        path_avatars: '/images/avatars/',
        liste_status: [
            'Employé',
            'Modérateur',
            '', '', '', '', '', '', '',
            'Administrateur'
        ],
        user: null,
        token: null
    },
    getters: {
        getDateActu() {
            const date_actu = new Date();
            const mois = date_actu.getMonth() < 9 ? '0' + (date_actu.getMonth() + 1) : '' + (date_actu.getMonth() + 1);
            const jour = date_actu.getDate() < 10 ? '0' + date_actu.getDate() : '' + date_actu.getDate();
            return date_actu.getFullYear() + '-' + mois + '-' + jour;
        },
        getPathAvatar(state) {
            return state.path_avatars + state.user.avatar;
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        }
    },
    actions: {
    },
    modules: {
    }
});
