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
                    <li><router-link to="/azerty">NOT FOUND</router-link></li>
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
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('token');
            }
        }
    }
</script>

<style scoped lang="scss">
    header {
        display: flex;
        background-color: #0060FF;
        border-bottom: 5px solid #004080;
        figure {
            text-align: center;
            padding: 20px;
            margin: 0;
        }
        .menu {
            figure {
                cursor: pointer;
                img {
                    height: 50px;
                }
            }
        }
        .logo {
            flex: 1;
            img {
                max-height: 50px;
                @media (max-width: 500px) {
		            display: none;
                }
            }
        }
        .profil {
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
        position: relative;
        ul {
            padding: 20px;
            margin: 0;
            li {
                list-style-type: none;
                padding: 8px;
                a {
                    color: #FFFF80;
                    font-weight: bold;
                    font-size: 1.2em;
                    text-decoration: none;
                    padding: 8px;
                    border-radius: 8px;
                    &:hover, &:focus, &:active {
                        background-color: #008080;
                        color: #FFD000;
                        font-style: italic;
                    }
                }
            }
        }
        .nav-appli {
            background-color: #2040D0;
            border-right: 5px solid #004080;
            border-bottom: 5px solid #004080;
            border-bottom-right-radius: 15px;
            position: absolute;
            top: 0; left: 0;
        }
        .nav-account {
            background-color: #2040D0;
            text-align: right;
            border-left: 5px solid #004080;
            border-bottom: 5px solid #004080;
            border-bottom-left-radius: 15px;
            position: absolute;
            top: 0; right: 0;
        }
    }
</style>
