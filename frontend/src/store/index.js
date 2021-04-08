import { createStore } from 'vuex';

export default createStore({
    state: {
        url_api: 'http://localhost:3000/api',
        path_avatars: '/images/avatars/',
        user: null,
        token: null
    },
    getters: {
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
