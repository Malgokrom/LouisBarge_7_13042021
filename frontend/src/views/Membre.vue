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
                        <td>{{ $store.state.liste_status[profil.status] }}</td>
                    </tr>
                </table>
                <div v-show="profil.description">
                    <div>Description</div>
                    <div>{{ profil.description }}</div>
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
            axios.post(this.$store.state.url_api + '/user/membre', {
                user_id: this.$store.state.user.id,
                user_status: this.$store.state.user.status,
                id: this.$route.params.id
            },
            {
                headers: {
                    authorization: 'token ' + this.$store.state.token
                }
            }).then((response) => {
                this.profil = response.data.profil;
            }).catch((error) => {
                this.message_serveur = error.response.data.message;
            });
        },
        data() {
            return {
                profil: false,
                message_serveur: false
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
