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
                <button type="submit" @click.prevent="rechercher">Rechercher</button>
            </form>
            <div>
                <h2 v-show="!search_nb_result">Aucun résultat</h2>
                <div class="search" v-for="line in search_result" @click="redirectMembre(line.id)">
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
            axios.get(this.$store.state.url_api + '/user/all', {
                params: {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status
                }, ...this.$store.getters.axiosDefautConfig
            })
            .then((response) => {
                this.search_result = response.data.membres;
                this.search_nb_result = this.search_result.length;
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
        },
        data() {
            return {
                form_search: false,
                search_result: [],
                search_nb_result: -1,
                search: {
                    nom: '',
                    prenom: '',
                    email: '',
                    status: '-1',
                    date_avant: this.$store.getters.getDateActu,
                    date_apres: this.$store.state.date_mise_en_service,
                    tri: 'DESC'
                }
            }
        },
        methods: {
            rechercher() {
                axios.get(this.$store.state.url_api + '/user/search', {
                    params: {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status,
                        ...this.search
                    }, ...this.$store.getters.axiosDefautConfig
                })
                .then((response) => {
                    this.search_result = response.data.membres;
                    this.search_nb_result = this.search_result.length;
                })
                .catch((error) => {
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
