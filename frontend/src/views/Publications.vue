<template>
    <div class="publications">
        <Vheader />
        <main>
            <h1>Publications</h1>
            <button @click="form_post = !form_post">Poster un message</button>
            <form v-show="form_post">
                <textarea rows="15" cols="50" v-model="post.texte"></textarea><br />
                <!-- Ajouter l'image -->
                <div @click="infos_bbcode = !infos_bbcode">Utilisation du BBcode :</div>
                <div v-show="infos_bbcode">
                    <p>[b]<b>Gras</b>[/b]</p>
                    <p>[i]<i>Italique</i>[/i]</p>
                    <p>[u]<u>Souligné</u>[/u]</p>
                    <p>[s]<s>Barré</s>[/s]</p>
                    <p>[sub]<sub>Indice</sub>[/sub]</p>
                    <p>[sup]<sup>Exposant</sup>[/sup]</p>
                </div>
                <button type="submit" @click="poster">Poster</button>
            </form>
            <button @click="form_search = !form_search">Rechercher</button>
            <form v-show="form_search">
                <table>
                    <tr>
                        <td><label for="texte">Texte :</label></td>
                        <td><input type="text" id="texte" v-model="search.texte" /></td>
                    </tr>
                    <tr>
                        <td><label for="nom">Nom :</label></td>
                        <td><input type="text" id="nom" v-model="search.nom" /></td>
                    </tr>
                    <tr>
                        <td><label for="prenom">Prénom :</label></td>
                        <td><input type="text" id="prenom" v-model="search.prenom" /></td>
                    </tr>
                    <tr>
                        <td><label for="status">Status :</label></td>
                        <td>
                            <select id="status" v-model="search.status">
                                <option value="-1" selected>Tous</option>
                                <option value="0">Employé</option>
                                <option value="1">Modérateur</option>
                                <option value="9">Administrateur</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div>Date de publication :</div>
                <div class="date-post">
                    <div :class="this.class.avant" @click="showDateAvant">Avant</div>
                    <div :class="this.class.apres" @click="showDateApres">Après</div>
                    <div :class="this.class.intervalle" @click="showDateIntervalle">Intervalle</div>
                </div>
                <table>
                    <tr v-show="input_date_avant">
                        <td>Date max :</td>
                        <td><input type="date" v-model="search.date_avant" /></td>
                    </tr>
                    <tr v-show="input_date_apres">
                        <td>Date min :</td>
                        <td><input type="date" v-model="search.date_apres" /></td>
                    </tr>
                </table>
                <div>
                    <label for="tri">Trier par date : </label>
                    <select id="tri" v-model="search.tri" >
                        <option value="DESC" selected>Descendant</option>
                        <option value="ASC">Ascendant</option>
                    </select>
                </div>
                <div>
                    <input type="checkbox" id="membre-suppr" v-model="search.membre_suppr" />
                    <label for="membre-suppr">Inclure les posts des membres supprimés</label>
                </div>
                <button type="submit" @click="rechercher">Rechercher</button>
            </form>
            <div>
                <h2 v-show="!search.nb_result">Aucun résultat</h2>
                <div class="search" v-for="line in search.result">
                    <div class="search__posts">
                        <div class="search__header">
                            <div class="search__author--exist" v-if="line.id_membres" @click="redirectMembre(line.id_membres)">
                                <img :src="this.$store.state.path_avatars + line.avatar" alt="Avatar du membre" />
                                {{ line.nom }} {{ line.prenom }}
                            </div>
                            <div class="search__author--no-exist" v-else>
                                <img :src="this.$store.state.path_avatars + 'suppr.svg'" alt="Profil supprimé" />
                                profil supprimé
                            </div>
                            <div>{{ line.date_post }}</div>
                        </div>
                        <div class="search__content" v-html="line.message"></div>
                    </div>
                    <div class="search__comments">
                        <!-- Ajouter les commentaires -->
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
        name: 'Publications',
        components: { Vheader, Vfooter },
        mounted() {
            this.recupPosts();
        },
        data() {
            return {
                form_post: false,
                infos_bbcode: false,
                post: {
                    texte: '',
                    image: null
                },
                form_search: false,
                input_date_avant: true,
                input_date_apres: false,
                search: {
                    texte: '',
                    nom: '',
                    prenom: '',
                    status: '-1',
                    date_avant: this.$store.getters.getDateActu,
                    date_apres: this.$store.state.date_mise_en_service,
                    tri: 'DESC',
                    membre_suppr: true,
                    result: [],
                    nb_result: -1
                },
                class: {
                    avant: 'select',
                    apres: 'no-select',
                    intervalle: 'no-select'
                }
            }
        },
        methods: {
            showDateAvant() {
                this.input_date_avant = true;
                this.input_date_apres = false;
                this.class.avant = 'select';
                this.class.apres = 'no-select';
                this.class.intervalle = 'no-select';
                this.search.date_apres = this.$store.state.date_mise_en_service;
            },
            showDateApres() {
                this.input_date_avant = false;
                this.input_date_apres = true;
                this.class.avant = 'no-select';
                this.class.apres = 'select';
                this.class.intervalle = 'no-select';
                this.search.date_avant = this.$store.getters.getDateActu;
            },
            showDateIntervalle() {
                this.input_date_avant = true;
                this.input_date_apres = true;
                this.class.avant = 'no-select';
                this.class.apres = 'no-select';
                this.class.intervalle = 'select';
                this.search.date_avant = this.$store.getters.getDateActu;
                this.search.date_apres = this.$store.state.date_mise_en_service;
            },
            poster(e) {
                e.preventDefault();
                axios.post(this.$store.state.url_api + '/message/post', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status,
                    post: this.post
                },
                {
                    headers: {
                        authorization: 'token ' + this.$store.state.token
                    }
                }).then((response) => {
                    alert(response.data.message);
                    this.post.texte = '';
                }).catch((error) => {
                    alert(error.response.data.message);
                });
            },
            recupPosts() {
                axios.post(this.$store.state.url_api + '/message/tous', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status
                },
                {
                    headers: {
                        authorization: 'token ' + this.$store.state.token
                    }
                }).then((response) => {
                    this.search.result = response.data.posts;
                    this.search.nb_result = this.search.result.length;
                }).catch((error) => {
                    alert(error.response.data.message);
                });
            },
            rechercher(e) {
                e.preventDefault();
                axios.post(this.$store.state.url_api + '/message/get', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status,
                    search: this.search
                },
                {
                    headers: {
                        authorization: 'token ' + this.$store.state.token
                    }
                }).then((response) => {
                    this.search.result = response.data.posts;
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
    .date-post {
        display: flex;
        > div {
            padding: 10px;
            margin: 10px;
            &.select {
                background-color: aqua;
            }
            &.no-select {
                background-color: yellow;
                cursor: pointer;
            }
        }
    }
    .search {
        background-color: lime;
        margin: 20px 0;
        &__header {
            background-color: yellow;
            display: flex;
            justify-content: space-between;
            > div {
                padding: 10px;
            }
            div:nth-child(1) {
                display: flex;
                align-items: flex-start;
                img {
                    max-height: 30px;
                    margin-right: 5px;
                }
            }
        }
        &__author {
            &--exist {
                cursor: pointer;
            }
            &--no-exist {
                color: purple;
            }
        }
        &__content {
            padding: 10px;
        }
    }
</style>
