<template>
    <div class="publications">
        <Vheader />
        <main>
            <h1>Publications</h1>
            <button @click="form_post = !form_post">Poster un message</button>
            <!--<form id="form-post" enctype="multipart/form-data" v-show="form_post"> -->
            <form v-show="form_post">
                <textarea rows="15" cols="50" v-model="post.texte"></textarea><br />
                <!-- <input type="file" id="img-post" name="image" ref="file" /> -->
                <div @click="infos_bbcode = !infos_bbcode">Utilisation du BBcode :</div>
                <div v-show="infos_bbcode">
                    <p>[b] <b>Gras</b> [/b]</p>
                    <p>[i] <i>Italique</i> [/i]</p>
                    <p>[u] <u>Souligné</u> [/u]</p>
                    <p>[s] <s>Barré</s> [/s]</p>
                    <p>[sub] <sub>Indice</sub> [/sub]</p>
                    <p>[sup] <sup>Exposant</sup> [/sup]</p>
                </div>
                <button type="submit" @click.prevent="poster">Poster</button>
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
                                <option v-for="status in $store.state.liste_status" :value="status.numero">{{ status.texte }}</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div>Date de publication :</div>
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
                    <label for="tri">Trier par date de post : </label>
                    <select id="tri" v-model="search.tri" >
                        <option value="DESC" selected>Descendant</option>
                        <option value="ASC">Ascendant</option>
                    </select>
                </div>
                <div>
                    <input type="checkbox" id="membre-suppr" v-model="search.membre_suppr" />
                    <label for="membre-suppr">Inclure les posts des membres supprimés</label>
                </div>
                <button type="submit" @click.prevent="rechercher">Rechercher</button>
            </form>
            <div>
                <h2 v-show="!search_nb_result">Aucun résultat</h2>
                <div class="search" v-for="line in search_result">
                    <div v-show="line.show_post">
                        <div class="posts">
                            <div class="posts__header">
                                <div class="posts__author--exist" v-if="line.id_membres" @click="redirectMembre(line.id_membres)">
                                    <img :src="$store.state.path_avatars + line.avatar" alt="Avatar du membre" />
                                    {{ line.nom }} {{ line.prenom }}
                                </div>
                                <div class="posts__author--no-exist" v-else>
                                    <img :src="$store.state.path_avatars + 'suppr.svg'" alt="Profil supprimé" />
                                    profil supprimé
                                </div>
                                <div>{{ line.date_post }}</div>
                            </div>
                            <div class="posts__opt">
                                <figure v-if="$store.state.user.status === line.status || $store.state.user.status === 9 || ($store.state.user.status === 1 && line.status !== 9)" @click="supprMessage(line.id); line.show_post = false">
                                    <img :src="$store.state.path_icones + 'trash-alt.svg'" alt="Supprimer le post" />
                                </figure>
                            </div>
                            <div class="posts__content" v-html="line.message"></div>
                        </div>
                        <div class="search__comments">
                            <div @click="comment_texte = ''; line.post_comment = !line.post_comment">
                                Poster un commentaire
                            </div>
                            <div v-show="line.post_comment">
                                <form>
                                    <textarea v-model="comment_texte"></textarea><br />
                                    <button type="submit" @click.prevent="postComment(line.id)">Poster</button>
                                </form>
                            </div>
                            <div @click="if (line.show_comments === 0) { line.num = recupComments(line.id); } line.show_comments = !line.show_comments">
                                Afficher les commentaires
                            </div>
                            <div v-show="line.show_comments">
                                <div v-for="comment in comments[line.num]">
                                    <div class="comments">
                                        <div v-show="comment.show_comment">
                                            <div class="comments__header">
                                                <div class="comments__author--exist" v-if="comment.id_membres" @click="redirectMembre(comment.id_membres)">
                                                    <img :src="$store.state.path_avatars + comment.avatar" alt="Avatar du membre" />
                                                    {{ comment.nom }} {{ comment.prenom }}
                                                </div>
                                                <div class="comments__author--no-exist" v-else>
                                                    <img :src="$store.state.path_avatars + 'suppr.svg'" alt="Profil supprimé" />
                                                    profil supprimé
                                                </div>
                                                <div>{{ comment.date_post }}</div>
                                            </div>
                                            <div class="comments__opt">
                                                <figure v-if="$store.state.user.status === comment.status || $store.state.user.status === 9 || ($store.state.user.status === 1 && comment.status !== 9)" @click="supprComment(comment.id); comment.show_comment = false">
                                                    <img :src="$store.state.path_icones + 'trash-alt.svg'" alt="Supprimer le post" />
                                                </figure>
                                            </div>
                                            <div class="comments__content" v-html="comment.message"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="no-comment" v-show="comments[line.num] !== undefined && !comments[line.num].length">
                                    Aucun commentaire
                                </div>
                            </div>
                        </div>
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
            axios.get(this.$store.state.url_api + '/message/all', {
                params: {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status
                }, ...this.$store.getters.axiosDefautConfig
            })
            .then((response) => {
                this.search_result = response.data.posts;
                this.search_nb_result = this.search_result.length;
            })
            .catch((error) => {
                alert(error.response.data.message);
            });
        },
        data() {
            return {
                form_post: false,
                infos_bbcode: false,
                post: {
                    texte: '',
                    /* Supprimer image ? */
                    image: null
                },
                form_search: false,
                search_result: [],
                search_nb_result: -1,
                search: {
                    texte: '',
                    nom: '',
                    prenom: '',
                    status: '-1',
                    date_avant: this.$store.getters.getDateActu,
                    date_apres: this.$store.state.date_mise_en_service,
                    tri: 'DESC',
                    membre_suppr: true
                },
                comments: [],
                num_comment: 0,
                comment_texte: ''
            }
        },
        methods: {
            /*poster() {
                const form = document.getElementById('form-post');
                const img_post = document.getElementById('img-post');
                let data = new FormData(form);
                data.append('user_id', this.$store.state.user.id);
                data.append('user_status', this.$store.state.user.status);
                data.append('texte', this.post.texte);
                data.append('image', img_post.files[0]);
                console.log(data.get('texte'));
                axios.post(this.$store.state.url_api + '/message/post', data, {
                    headers: {
                        authorization: 'token ' + this.$store.state.token,
                        'Content-Type' : 'multipart/form-data'
                    }
                })
                .then((response) => {
                    alert(response.data.message);
                    this.post.texte = '';
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            },*/
            poster() {
                axios.post(this.$store.state.url_api + '/message/post', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status,
                    texte: this.post.texte,
                    image: this.post.image
                }, this.$store.getters.axiosDefautConfig)
                .then((response) => {
                    alert(response.data.message);
                    this.post.texte = '';
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            },
            rechercher() {
                axios.get(this.$store.state.url_api + '/message/search', {
                    params: {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status,
                        ...this.search
                    }, ...this.$store.getters.axiosDefautConfig
                })
                .then((response) => {
                    this.search_result = response.data.posts;
                    this.search_nb_result = this.search_result.length;
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            },
            postComment(id_post) {
                if (!this.comment_texte) { alert('Le commentaire ne doit pas être vide.'); }
                else {
                    axios.post(this.$store.state.url_api + '/comment/' + id_post, {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status,
                        texte: this.comment_texte
                    }, this.$store.getters.axiosDefautConfig)
                    .then((response) => {
                        alert(response.data.message);
                    })
                    .catch((error) => {
                        alert(error.response.data.message);
                    });
                }
            },
            recupComments(id_post) {
                axios.get(this.$store.state.url_api + '/comment/' + id_post, {
                    params: {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status
                    }, ...this.$store.getters.axiosDefautConfig
                })
                .then((response) => {
                    this.comments.push(response.data.comments);
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
                this.num_comment++;
                return this.num_comment - 1;
            },
            supprMessage(id_post) {
                axios.delete(this.$store.state.url_api + '/message/' + id_post, {
                    data: {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status
                    }, ...this.$store.getters.axiosDefautConfig
                })
                .then((response) => {
                    alert(response.data.message);
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            },
            supprComment(id_comment) {
                axios.delete(this.$store.state.url_api + '/comment/' + id_comment, {
                    data: {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status
                    }, ...this.$store.getters.axiosDefautConfig
                })
                .then((response) => {
                    alert(response.data.message);
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
        margin: 20px 0;
        &__comments {
            background-color: aqua;
            padding: 10px;
        }
    }
    .posts, .comments {
        &__header {
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
        &__opt {
            display: flex;
            justify-content: flex-end;
            figure {
                padding: 5px;
                margin: 0;
                img {
                    height: 25px;
                    cursor: pointer;
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
    .posts {
        &__header {
            background-color: yellow;
        }
        &__opt {
            background-color: orange;
        }
        &__content {
            background-color: lime;
        }
    }
    .comments {
        margin-top: 10px;
        &__header {
            background-color: olive;
        }
        &__opt {
            background-color: olivedrab;
        }
        &__content {
            background-color: teal;
        }
    }
    .no-comment {
        background-color: blue;
        padding: 10px;
    }
</style>
