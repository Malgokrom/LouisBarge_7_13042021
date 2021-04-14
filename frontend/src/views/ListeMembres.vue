<template>
    <div class="liste-membres">
        <Vheader />
        <main>
            <h1>Liste des membres</h1>
            <button @click="form_search = !form_search">Rechercher</button>
            <form v-show="form_search">
                <table>
                    <tr>
                        <td><label for="nom">Nom :</label></td>
                        <td><input type="text" id="nom" v-model="search.nom" /></td>
                    </tr>
                    <tr>
                        <td><label for="prenom">Prénom :</label></td>
                        <td><input type="text" id="prenom" v-model="search.prenom" /></td>
                    </tr>
                    <tr>
                        <td><label for="email">Email :</label></td>
                        <td><input type="text" id="email" v-model="search.email" /></td>
                    </tr>
                    <tr>
                        <td><label for="status">Status :</label></td>
                        <td>
                            <select id="status" v-model="search.status">
                                <option value="-1" selected>Tous</option>
                                <option v-for="status in $store.state.liste_status" :value="status.numero">{{ status.texte }}</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div>Date d'inscription :</div>
                <table>
                    <tr>
                        <td>entre le :</td>
                        <td><input type="date" v-model="search.date_apres" /></td>
                    </tr>
                    <tr>
                        <td>et le :</td>
                        <td><input type="date" v-model="search.date_avant" /></td>
                    </tr>
                </table>
                <div>
                    <label for="tri">Trier par date d'inscription : </label>
                    <select id="tri" v-model="search.tri" >
                        <option value="DESC" selected>Descendant</option>
                        <option value="ASC">Ascendant</option>
                    </select>
                </div>
                <button type="submit" @click="rechercher">Rechercher</button>
            </form>
            <div>
                <h2 v-show="!search.nb_result">Aucun résultat</h2>
                <div class="search" v-for="line in search.result" @click="redirectMembre(line.id)">
                    <figure class="search__avatar">
                        <img :src="$store.state.path_avatars + line.avatar" alt="Avatar du membre" />
                    </figure>
                    <div class="search__identite">
                        <div>{{ line.nom }} {{ line.prenom }}</div>
                        <div>{{ line.email }}</div>
                        <div>{{ $store.getters.getStatusTexte(line.status) }}</div>
                    </div>
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
        name: 'ListeMembres',
        components: { Vheader, Vfooter },
        mounted() {
            axios.post(this.$store.state.url_api + '/user/tous', {
                user_id: this.$store.state.user.id,
                user_status: this.$store.state.user.status
            },
            {
                headers: {
                    authorization: 'token ' + this.$store.state.token
                }
            }).then((response) => {
                this.search.result = response.data.membres;
                this.search.nb_result = this.search.result.length;
            }).catch((error) => {
                alert(error.response.data.message);
            });
        },
        data() {
            return {
                form_search: false,
                search: {
                    nom: '',
                    prenom: '',
                    email: '',
                    status: '-1',
                    date_avant: this.$store.getters.getDateActu,
                    date_apres: this.$store.state.date_mise_en_service,
                    tri: 'DESC',
                    result: [],
                    nb_result: -1
                }
            }
        },
        methods: {
            rechercher(e) {
                e.preventDefault();
                axios.post(this.$store.state.url_api + '/user/get', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status,
                    search: this.search
                },
                {
                    headers: {
                        authorization: 'token ' + this.$store.state.token
                    }
                }).then((response) => {
                    this.search.result = response.data.membres;
                    this.search.nb_result = this.search.result.length;
                }).catch((error) => {
                    alert(error.response.data.message);
                });
            },
            redirectMembre(id) {
                this.$router.push('/membre/' + id);
            }
        }
    }
</script>

<style scoped lang="scss">
    .search {
        background-color: yellow;
        padding: 10px;
        margin: 10px;
        cursor: pointer;
        &__avatar img {
            max-height: 50px;
        }
    }
</style>
