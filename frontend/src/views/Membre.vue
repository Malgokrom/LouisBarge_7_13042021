<template>
    <div class="membre">
        <Vheader />
        <main>
            <div v-show="message_serveur">{{ message_serveur }}</div>
            <div v-show="profil">
                <figure>
                    <img :src="$store.state.path_avatars + profil.avatar" alt="Avatar du membre" />
                </figure>
                <table>
                    <tr>
                        <td>Nom :</td>
                        <td>{{ profil.nom }}</td>
                    </tr>
                    <tr>
                        <td>Prénom :</td>
                        <td>{{ profil.prenom }}</td>
                    </tr>
                    <tr>
                        <td>Email :</td>
                        <td>{{ profil.email }}</td>
                    </tr>
                    <tr>
                        <td>Inscription :</td>
                        <td>{{ profil.date_inscription }}</td>
                    </tr>
                    <tr>
                        <td>Dernière connexion :</td>
                        <td>{{ profil.derniere_connexion }}</td>
                    </tr>
                    <tr>
                        <td>Status :</td>
                        <td>{{ $store.getters.getStatusTexte(profil.status) }}</td>
                    </tr>
                </table>
                <div v-show="profil.description">
                    <div>Description :</div>
                    <div v-html="profil.description"></div>
                </div>
                <div v-if="$store.state.user.status === 9 && profil.status !== 9">
                    <div v-if="profil.status !== 0"><button @click="setStatus(0)">Définir comme employé</button></div>
                    <div v-if="profil.status !== 1"><button @click="setStatus(1)">Définir comme modérateur</button></div>
                    <div v-if="profil.status !== 9"><button @click="supprProfil()">Supprimer le profil</button></div>
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

</style>
