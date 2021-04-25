<template>
    <div class="membre">
        <Vheader />
        <main>
            <div v-show="message_serveur">{{ message_serveur }}</div>
            <div class="profil" v-show="profil">
                <figure v-if="profil.avatar !== undefined" class="profil__image">
                    <img :src="$store.state.path_avatars + profil.avatar" alt="Avatar du membre" />
                </figure>
                <table class="profil__infos">
                    <tr>
                        <td>Nom&nbsp;:</td>
                        <td>{{ profil.nom }}</td>
                    </tr>
                    <tr>
                        <td>Prénom&nbsp;:</td>
                        <td>{{ profil.prenom }}</td>
                    </tr>
                    <tr>
                        <td>Email&nbsp;:</td>
                        <td>{{ profil.email }}</td>
                    </tr>
                    <tr>
                        <td>Inscription&nbsp;:</td>
                        <td>{{ profil.date_inscription }}</td>
                    </tr>
                    <tr>
                        <td>Connexion&nbsp;:</td>
                        <td>{{ profil.derniere_connexion }}</td>
                    </tr>
                    <tr>
                        <td>Status&nbsp;:</td>
                        <td>{{ $store.getters.getStatusTexte(profil.status) }}</td>
                    </tr>
                </table>
                <div class="profil__description" v-show="profil.description">
                    <div>Description&nbsp;:</div>
                    <div v-html="profil.description"></div>
                </div>
                <div class="profil__actions" v-if="$store.state.user.status === 9 && profil.status !== 9">
                    <button v-if="profil.status !== 0" @click="setStatus(0)">Définir comme employé</button>
                    <button v-if="profil.status !== 1" @click="setStatus(1)">Définir comme modérateur</button>
                    <button v-if="profil.status !== 9" @click="supprProfil()">Supprimer le profil</button>
                </div>
            </div>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import axios from 'axios';

    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'Membre',
        components: { Vheader, Vfooter },
        mounted() {
            axios.get(this.$store.state.url_api + '/user/' + this.$route.params.id, {
                params: {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status
                }, ...this.$store.getters.axiosDefautConfig
            })
            .then((response) => {
                this.profil = response.data.profil;
            })
            .catch((error) => {
                this.message_serveur = error.response.data.message;
            });
        },
        data() {
            return {
                profil: false,
                message_serveur: false
            }
        },
        methods: {
            setStatus(status) {
                axios.put(this.$store.state.url_api + '/user/status', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status,
                    id: this.$route.params.id,
                    status: status
                }, this.$store.getters.axiosDefautConfig)
                .then((response) => {
                    this.profil.status = status;
                    alert(response.data.message);
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            },
            supprProfil() {
                axios.delete(this.$store.state.url_api + '/user/' + this.$route.params.id, {
                    data: {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status
                    }, ...this.$store.getters.axiosDefautConfig
                })
                .then((response) => {
                    alert(response.data.message);
                    this.$router.push('/listemembres');
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .profil {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 700px;
        max-width: 100%;
        padding: 20px 0;
        &__image {
            img {
                max-width: 100%;
            }
        }
        &__infos {
            margin: 15px auto;
            tr {
                td {
                    &:nth-child(1) {
                        font-weight: bold;
                        text-align: right;
                        padding-right: 10px;
                    }
                }
            }
        }
        &__description {
            margin: 0 auto;
            div:nth-child(1) {
                font-weight: bold;
            }
            div:nth-child(2) {
                background-color: #90B0FF;
                padding: 10px;
                margin: 10px 0;
                border: 4px groove #4080C0;
                border-radius: 10px;

            }
        }
        &__actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            button {
                display: block;
                background-color: #003070;
                color: #FFFFFF;
                font-weight: bold;
                width: 100%;
                max-width: 350px;
                margin: 10px;
                padding: 15px 30px;
                border: 3px groove #0056AD;
                border-radius: 15px;
                cursor: pointer;
                outline: none;
                transition: all 300ms;
                &:hover, &:focus, &:active {
                    background-color: #005090;
                }
            }
        }
    }
</style>
