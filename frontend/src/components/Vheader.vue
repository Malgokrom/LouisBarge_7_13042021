<template>
    <div class="vheader">
        <header>
            <div class="menu">
                <figure @click="showNavAppli">
                    <img src="../assets/icones/bars.svg" alt="Menu" />
                </figure>
            </div>
            <div class="logo">
                <figure>
                    <img src="../assets/logos/groupomania_black.svg" alt="Logo Groupomania" />
                </figure>
            </div>
            <div class="profil">
                <figure @click="showNavAccount">
                    <img src="../assets/icones/angle-down.svg" alt="Flèche bas" v-show="!nav_account" />
                    <img src="../assets/icones/angle-up.svg" alt="Flèche haut" v-show="nav_account" />
                    <img :src="this.$store.getters.getPathAvatar" alt="Avatar" />
                </figure>
            </div>
        </header>
        <nav>
            <div class="nav-appli" v-show="nav_appli">
                <ul>
                    <li><router-link to="/publications">Publications</router-link></li>
                    <li><router-link to="/listemembres">Membres</router-link></li>
                    <li><router-link to="/reglement">Règlement</router-link></li>
                </ul>
            </div>
            <div class="nav-account" v-show="nav_account">
                <ul>
                    <li><router-link to="/profil">Éditer mon profil</router-link></li>
                    <li><router-link to="/preferences">Préférences</router-link></li>
                    <li><router-link @click="deconnexion" to="/">Déconnexion</router-link></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: 'Vheader',
        data() {
            return {
                nav_appli: false,
                nav_account: false
            }
        },
        methods: {
            showNavAppli() {
                this.nav_appli = !this.nav_appli;
                if (this.nav_appli) {
                    this.nav_account = false;
                }
            },
            showNavAccount() {
                this.nav_account = !this.nav_account;
                if (this.nav_account) {
                    this.nav_appli = false;
                }
            },
            deconnexion() {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                this.$store.commit('setUser', null);
                this.$store.commit('setToken', null);
            }
        }
    }
</script>

<style scoped lang="scss">
    header {
        display: flex;
        background-color: #FFFF80;
        figure {
            text-align: center;
            padding: 20px;
            margin: 0;
        }
        .menu {
            background-color: red;
            figure {
                cursor: pointer;
                img {
                    height: 50px;
                }
            }
        }
        .logo {
            flex: 1;
            background-color: blue;
            img {
                max-height: 50px;
            }
        }
        .profil {
            background-color: lime;
            figure {
                cursor: pointer;
                img {
                    height: 50px;
                    &:nth-child(1), &:nth-child(2) {
                        margin-right: 10px;
                    }
                }
            }
        }
    }
    nav {
        background-color: blue;
        position: relative;
        ul {
            padding: 20px;
            margin: 0;
        }
        li {
            list-style-type: none;
        }
        .nav-appli {
            background-color: yellow;
            position: absolute;
            top: 0; left: 0;
        }
        .nav-account {
            background-color: aqua;
            position: absolute;
            top: 0; right: 0;
        }
    }
</style>
