<template>
    <div class="home">
        <figure class="home__logo">
            <img src="../assets/logos/icon.svg" alt="Logo" />
        </figure>
        <h1 class="home__titre">Connexion</h1>
        <form class="home__form">
            <div>
                <label for="email">Email :</label><br />
                <input type="email" id="email" placeholder="email" v-model="email" />
            </div>
            <div>
                <label for="mdp">Mot de passe :</label><br />
                <input type="password" id="mdp" placeholder="mot de passe" v-model="mdp" />
            </div>
            <input type="checkbox" id="co-auto" v-model="connexion_auto" />
            <label for="co-auto">Connexion automatique</label>
            <button type="submit" @click.prevent="envoyer">Se connecter</button>
        </form>
        <div class="home__lien">
            Vous n'avez pas encore de compte ?<br />
            <router-link to="/inscription">Inscrivez-vous ici.</router-link>
        </div>
        <div class="home__messages">
            <p v-show="message_serveur">{{ message_serveur }}</p>
        </div>
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
                body: document.getElementsByTagName('body')[0],
                email: '',
                mdp: '',
                connexion_auto: false,
                message_serveur: false
            }
        },
        methods: {
            envoyer() {
                this.message_serveur = false;
                axios.get(this.$store.state.url_api + '/user/login', {
                    params: {
                        email: this.email,
                        mdp: this.mdp
                    }
                })
                .then((response) => {
                    if (this.connexion_auto) {
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        localStorage.setItem('token', response.data.token);
                    }
                    this.$store.commit('setUser', response.data.user);
                    this.$store.commit('setToken', response.data.token);
                    this.$store.commit('preferencesAll', response.data.preferences);
                    this.body.style.fontSize = this.$store.state.preferences.texte;
                    this.body.style.fontFamily = this.$store.state.preferences.police;
                    this.$router.push('/publications');
                })
                .catch((error) => {
                    this.message_serveur = error.response.data.message;
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .home {
        padding: 20px;
        &__logo {
            height: 100px;
            margin: 0 auto;
            img {
                height: 100%;
            }
        }
        &__titre {
            text-align: center;
            margin: 0 0 10px 0;
        }
        &__form {
            margin: 0 auto;
            div {
                margin: 10px 0 10px 0;
                label {
                    position: relative;
                    bottom: 3px;
                }
                input {
                    width: 100%;
                    padding: 5px;
                    border: 3px groove #808080;
                    border-radius: 8px;
                    outline: none;
                    &:focus {
                        border-color: #0056ad;
                    }
                }
            }
            button {
                display: block;
                background-color: #003070;
                color: #FFFFFF;
                font-weight: bold;
                width: 100%;
                margin-top: 20px;
                padding: 10px;
                border: 3px groove #0056ad;
                border-radius: 15px;
                cursor: pointer;
                outline: none;
                transition: all 300ms;
                &:hover, &:focus, &:active {
                    background-color: #005090;
                }
            }
        }
        &__lien {
            text-align: center;
            margin-top: 20px;
            a {
                color: #0000FF;
                font-weight: bold;
                text-decoration: none;
                transition: all 300ms;
                &:hover, &:active {
                    color: #0040FF;
                    font-style: italic;
                }
            }
        }
        &__messages {
            color: #FF4000;
            font-weight: bold;
            margin: 0 auto;
        }
    }
</style>
