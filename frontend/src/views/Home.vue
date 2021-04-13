<template>
    <div class="home">
        <h1>Connexion</h1>
        <form>
            <input type="email" placeholder="email" v-model="email" /><br />
            <input type="password" placeholder="mot de passe" v-model="mdp" /><br />
            <input type="checkbox" id="co_auto" v-model="connexion_auto" /> <label for="co_auto">Connexion automatique</label><br />
            <button type="submit" @click="envoyer">Se connecter</button>
        </form>
        <p>
            Vous n'avez pas encore de compte ?<br />
            <router-link to="/inscription">Inscrivez-vous ici.</router-link>
        </p>
        <p v-show="message_serveur">
            {{ message_serveur }}
        </p>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Home',
        beforeCreate() {
            if (localStorage.getItem('user') && localStorage.getItem('token')) {
                this.$store.commit('setUser', JSON.parse(localStorage.getItem('user')));
                this.$store.commit('setToken', localStorage.getItem('token'));
                this.$router.push('/publications');
            }
        },
        data() {
            return {
                email: '',
                mdp: '',
                connexion_auto: false,
                message_serveur: false
            }
        },
        methods: {
            envoyer(e) {
                e.preventDefault();
                this.message_serveur = false;
                axios.post(this.$store.state.url_api + '/user/login', {
                    email: this.email,
                    mdp: this.mdp
                }).then((response) => {
                    if (this.connexion_auto) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        localStorage.setItem('token', response.data.token);
                    }
                    this.$store.commit('setUser', response.data.user);
                    this.$store.commit('setToken', response.data.token);
                    this.$router.push('/publications');
                }).catch((error) => {
                    this.message_serveur = error.response.data.message;
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .home {
        text-align: center;
    }
</style>
