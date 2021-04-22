<template>
    <div class="publications">
        <Vheader />
        <main>
            <h1>Publications</h1>
            <div class="btn-show" @click="form_post = !form_post">
                <div>Poster un message</div>
                <figure>
                    <img src="../assets/icones/angle-down.svg" alt="Flèche bas" v-show="!form_post" />
                    <img src="../assets/icones/angle-up.svg" alt="Flèche haut" v-show="form_post" />
                </figure>
            </div>
            <!--<form id="form-post" enctype="multipart/form-data" v-show="form_post"> -->
            <form class="form-post" v-show="form_post">
                <textarea class="form-post__texte" v-model="post.texte"></textarea><br />
                <!-- <input type="file" id="img-post" name="image" ref="file" /> -->
                <div class="form-post__show-bbcode" @click="infos_bbcode = !infos_bbcode">Utilisation du BBcode</div>
                <div class="form-post__infos-bbcode" v-show="infos_bbcode">
                    <p>[b]<b> Gras </b>[/b]</p>
                    <p>[i]<i> Italique </i>[/i]</p>
                    <p>[u]<u> Souligné </u>[/u]</p>
                    <p>[s]<s> Barré </s>[/s]</p>
                    <p>[sub]<sub> Indice </sub>[/sub]</p>
                    <p>[sup]<sup> Exposant </sup>[/sup]</p>
                </div>
                <button class="form-post__btn" type="submit" @click.prevent="poster">Poster</button>
            </form>
            <div class="btn-show" @click="form_search = !form_search">
                <div>Rechercher</div>
                <figure>
                    <img src="../assets/icones/angle-down.svg" alt="Flèche bas" v-show="!form_search" />
                    <img src="../assets/icones/angle-up.svg" alt="Flèche haut" v-show="form_search" />
                </figure>
            </div>
            <form class="form-search" v-show="form_search">
                <h2 class="form-search__titre">Recherche</h2>
                <table class="form-search__infos">
                    <tr>
                        <td><label for="texte">Texte&nbsp;:</label></td>
                        <td><input type="text" id="texte" v-model="search.texte" /></td>
                    </tr>
                    <tr>
                        <td><label for="nom">Nom&nbsp;:</label></td>
                        <td><input type="text" id="nom" v-model="search.nom" /></td>
                    </tr>
                    <tr>
                        <td><label for="prenom">Prénom&nbsp;:</label></td>
                        <td><input type="text" id="prenom" v-model="search.prenom" /></td>
                    </tr>
                    <tr>
                        <td><label for="status">Status&nbsp;:</label></td>
                        <td>
                            <select id="status" v-model="search.status">
                                <option value="-1" selected>Tous</option>
                                <option v-for="status in $store.state.liste_status" :value="status.numero">{{ status.texte }}</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <table class="form-search__dates">
                    <caption>Date de publication</caption>
                    <tr>
                        <td>entre le :</td>
                        <td><input type="date" v-model="search.date_apres" /></td>
                    </tr>
                    <tr>
                        <td>et le :</td>
                        <td><input type="date" v-model="search.date_avant" /></td>
                    </tr>
                </table>
                <div class="form-search__tri">
                    <label for="tri">Trier par date de post&nbsp;:&nbsp;</label>
                    <select id="tri" v-model="search.tri" >
                        <option value="DESC" selected>Descendant</option>
                        <option value="ASC">Ascendant</option>
                    </select>
                </div>
                <div class="form-search__membre-suppr">
                    <input type="checkbox" id="membre-suppr" v-model="search.membre_suppr" />
                    <label for="membre-suppr">Posts des membres supprimés</label>
                </div>
                <button class="form-search__btn" type="submit" @click.prevent="rechercher">Rechercher</button>
            </form>
            <div id="response">
                <h2 class="no-post" v-show="!search_nb_result">Aucun résultat</h2>
                <div class="search" v-for="line in search_result">
                    <div class="search__item" v-show="line.show_post">
                        <div class="posts">
                            <div class="posts__header">
                                <div class="posts__author--exist" v-if="line.id_membres" @click="redirectMembre(line.id_membres)">
                                    <figure>
                                        <img :src="$store.state.path_avatars + line.avatar" alt="Avatar du membre" />
                                    </figure>
                                    <div>{{ line.nom }} {{ line.prenom }}</div>
                                </div>
                                <div class="posts__author--no-exist" v-else>
                                    <figure>
                                        <img :src="$store.state.path_avatars + 'suppr.png'" alt="Profil supprimé" />
                                    </figure>
                                    <div>profil supprimé</div>
                                </div>
                                <div>{{ line.date_post }}</div>
                            </div>
                            <div class="posts__opt">
                                <figure v-if="$store.state.user.id === line.id_membres || $store.state.user.status === 9 || ($store.state.user.status === 1 && line.status !== 9)" @click="supprMessage(line.id); line.show_post = false">
                                    <img :src="$store.state.path_icones + 'trash-alt.svg'" alt="Supprimer le post" title="Supprimer" />
                                </figure>
                            </div>
                            <div class="posts__content" v-html="line.message"></div>
                        </div>
                        <div class="search__comments">
                            <div class="search__comment-show">
                                <div @click="if (line.show_comments === 0) { line.num = recupComments(line.id); } line.show_comments = !line.show_comments">
                                    Commentaires
                                </div>
                                <div @click="comment_texte = ''; line.post_comment = !line.post_comment">
                                    Commenter
                                </div>
                            </div>
                            <div v-show="line.post_comment">
                                <form class="form-comment">
                                    <textarea v-model="comment_texte"></textarea><br />
                                    <button type="submit" @click.prevent="postComment(line.id)">Commenter</button>
                                </form>
                            </div>
                            <div v-show="line.show_comments">
                                <div v-for="comment in comments[line.num]">
                                    <div class="comments">
                                        <div v-show="comment.show_comment">
                                            <div class="comments__header">
                                                <div class="comments__author--exist" v-if="comment.id_membres" @click="redirectMembre(comment.id_membres)">
                                                    <figure>
                                                        <img :src="$store.state.path_avatars + comment.avatar" alt="Avatar du membre" />
                                                    </figure>
                                                    <div>{{ comment.nom }} {{ comment.prenom }}</div>
                                                </div>
                                                <div class="comments__author--no-exist" v-else>
                                                    <figure>
                                                        <img :src="$store.state.path_avatars + 'suppr.svg'" alt="Profil supprimé" />
                                                    </figure>
                                                    <div>profil supprimé</div>
                                                </div>
                                                <div>{{ comment.date_post }}</div>
                                            </div>
                                            <div class="comments__opt">
                                                <figure v-if="$store.state.user.id === comment.id_membres || $store.state.user.status === 9 || ($store.state.user.status === 1 && comment.status !== 9)" @click="supprComment(comment.id); comment.show_comment = false">
                                                    <img :src="$store.state.path_icones + 'trash-alt.svg'" alt="Supprimer le commentaire" title="Supprimer" />
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
    h1 {
        margin-bottom: 0;
    }
    .btn-show {
        display: flex;
        align-items: center;
        background-color: #60A0FF;
        font-size: 1.2em;
        font-weight: bold;
        padding: 10px 30px;
        margin-top: 20px;
        border-radius: 10px;
        cursor: pointer;
        figure {
            width: 20px;
            margin: 0 0 0 15px;
        }
    }
    .form-post {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: 20px 0;
        &__texte {
            display: block;
            font-size: 1.2em;
            width: 100%;
            max-width: 500px;
            height: 150px;
        }
        &__show-bbcode {
            background-color: #60A0FF;
            padding: 5px 10px;
            margin-top: 20px;
            border-radius: 5px;
            cursor: pointer;
        }
        &__infos-bbcode {
            p {
                color: #404000;
                margin: 10px 0 0 0;
                * {
                    color: #000000;
                }
            }
        }
        &__btn {
            display: block;
            background-color: #003070;
            color: #FFFFFF;
            font-weight: bold;
            margin: 20px auto 0 auto;
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
    .form-search {
        background-color: #90B0FF;
        padding: 15px;
        margin: 20px 0 0 0;
        border: 4px groove #4080C0;
        border-radius: 10px;
        h2 {
            text-align: center;
            margin: 0px 0 15px 0;
        }
        &__infos {
            td {
                padding: 3px 0;
                input {
                    width: 100%;
                    padding: 5px;
                    border: 3px groove #808080;
                    border-radius: 8px;
                    outline: none;
                    &:focus {
                        border-color: #0056AD;
                    }
                }
            }
            td:nth-child(1) {
                text-align: right;
                padding-right: 5px;
            }
        }
        &__dates {
            margin: 10px auto;
            caption {
                font-size: 1.2em;
                margin-bottom: 5px;
            }
            td:nth-child(1) {
                text-align: right;
                padding-right: 5px;
            }
        }
        &__tri {
            text-align: center;
            select {
                margin-top: 5px;
            }
        }
        &__membre-suppr {
            margin: 15px 0;
        }
        &__btn {
            display: block;
            background-color: #003070;
            color: #FFFFFF;
            font-weight: bold;
            margin: 20px auto 0 auto;
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
    .form-comment {
        margin-top: 10px;
        textarea {
            font-size: 1.2em;
            width: 100%;
            height: 150px;
        }
        button {
            display: block;
            background-color: #003070;
            color: #FFFFFF;
            font-weight: bold;
            width: 100%;
            padding: 10px 20px;
            border: 3px groove #0056AD;
            cursor: pointer;
            outline: none;
            transition: all 300ms;
            &:hover, &:focus, &:active {
                background-color: #005090;
            }
        }
    }
    .search {
        max-width: 600px;
        margin: 30px auto;
        &__item {
            box-shadow: 5px 5px 5px #6080C0;
            border-radius: 10px;
            overflow: hidden;
        }
        &__comment-show {
            display: flex;
            justify-content: space-between;
            > div {
                color: #0000FF;
                font-weight: bold;
                cursor: pointer;
                &:hover {
                    font-style: italic;
                }
            }
        }
        &__comments {
            background-color: #90C0E0;
            padding: 10px;
        }
    }
    .posts, .comments {
        &__header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            > div {
                padding: 10px;
            }
            div:nth-child(1) {
                display: flex;
                min-width: 0;
                max-width: 100%;
                > div {
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                figure {
                    margin: 0;
                }
                img {
                    height: 38px;
                    margin-right: 10px;
                }
            }
            div:nth-child(2) {
                text-align: right;
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
            background-color: #8090FF;
        }
        &__opt {
            background-color: #6070D0;
        }
        &__content {
            background-color: #C0FFFF;
        }
    }
    .comments {
        margin-top: 10px;
        border-radius: 10px;
        overflow: hidden;
        &__header {
            background-color: #90FF80;
        }
        &__opt {
            background-color: #70D060;
        }
        &__content {
            background-color: #FFFFC0;
        }
    }
    #response {
        width: 100%;
    }
    .no-post {
        text-align: center;
    }
    .no-comment {
        background-color: #600060;
        color: #FFFFFF;
        text-align: center;
        font-weight: bold;
        padding: 10px;
        margin-top: 10px;
        border-radius: 10px;
    }
</style>
