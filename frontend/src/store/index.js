import { createStore } from 'vuex';

export default createStore({
    state: {
        date_mise_en_service: '2021-01-01',
        url_api: 'http://localhost:3000/api',
        path_avatars: '/images/avatars/',
        liste_status: [
            { numero: 0, texte: 'Employé' },
            { numero: 1, texte: 'Modérateur' },
            { numero: 9, texte: 'Administrateur' }
        ],
        preferences: {},
        user: null,
        token: null
    },
    getters: {
        axiosDefautConfig(state) {
            return { headers: { authorization: 'token ' + state.token } };
        },
        getDateActu() {
            const date_actu = new Date();
            const mois = date_actu.getMonth() < 9 ? '0' + (date_actu.getMonth() + 1) : '' + (date_actu.getMonth() + 1);
            const jour = date_actu.getDate() < 10 ? '0' + date_actu.getDate() : '' + date_actu.getDate();
            return date_actu.getFullYear() + '-' + mois + '-' + jour;
        },
        getPathAvatar(state) {
            return state.path_avatars + state.user.avatar;
        },
        getStatusTexte: (state) => (status) => {
            for (let i = 0, c = state.liste_status.length; i < c; i++) {
                if (status === state.liste_status[i].numero) { return state.liste_status[i].texte; }
            }
        }
    },
    mutations: {
        setUser(state, user) { state.user = user; },
        setToken(state, token) { state.token = token; },
        preferencesAll(state, all) { state.preferences = all; },
        preferencesTexte(state, texte) { state.preferences.texte = texte; },
        preferencesPolice(state, police) { state.preferences.police = police; }
    },
    actions: {
    },
    modules: {
    }
});
