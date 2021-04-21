<template>
    <div class="liste-membres">
        <Vheader />
        <main>
            <h1>Liste des membres</h1>
            <div class="btn-form" @click="form_search = !form_search">
                <div>Rechercher</div>
                <figure>
                    <img src="../assets/icones/angle-down.svg" alt="Flèche bas" v-show="!form_search" />
                    <img src="../assets/icones/angle-up.svg" alt="Flèche haut" v-show="form_search" />
                </figure>
            </div>
            <form class="form-search" v-show="form_search">
                <h2 class="form-search__titre">Recherche</h2>
                <table class="form-search__infos-users">
                    <tr>
                        <td><label for="nom">Nom&nbsp;:</label></td>
                        <td><input type="text" id="nom" v-model="search.nom" /></td>
                    </tr>
                    <tr>
                        <td><label for="prenom">Prénom&nbsp;:</label></td>
                        <td><input type="text" id="prenom" v-model="search.prenom" /></td>
                    </tr>
                    <tr>
                        <td><label for="email">Email&nbsp;:</label></td>
                        <td><input type="text" id="email" v-model="search.email" /></td>
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
                    <caption>Date d'inscription&nbsp;:</caption>
                    <tr>
                        <td>entre le&nbsp;:</td>
                        <td><input type="date" v-model="search.date_apres" /></td>
                    </tr>
                    <tr>
                        <td>et le&nbsp;:</td>
                        <td><input type="date" v-model="search.date_avant" /></td>
                    </tr>
                </table>
                <div  class="form-search__tri">
                    <label for="tri">Trier par date d'inscription&nbsp;:</label><br />
                    <select id="tri" v-model="search.tri" >
                        <option value="DESC" selected>Descendant</option>
                        <option value="ASC">Ascendant</option>
                    </select>
                </div>
                <button class="form-search__btn" type="submit" @click.prevent="rechercher">Rechercher</button>
            </form>
            <div class="result">
                <h2 class="result__titre" v-show="!search_nb_result">Aucun résultat</h2>
                <div class="result__search" v-for="line in search_result" @click="redirectMembre(line.id)">
                    <figure class="result__avatar">
                        <img :src="$store.state.path_avatars + line.avatar" alt="Avatar du membre" />
                    </figure>
                    <div class="result__identite">
                        {{ line.nom }} {{ line.prenom }}<br />
                        {{ line.email }}<br />
                        {{ $store.getters.getStatusTexte(line.status) }}
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
    .btn-form {
        display: flex;
        align-items: center;
        background-color: #60A0FF;
        font-size: 1.2em;
        font-weight: bold;
        padding: 10px 30px;
        border-radius: 10px;
        cursor: pointer;
        figure {
            width: 20px;
            margin: 0 0 0 15px;
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
        &__infos-users {
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
    .result {
        width: 100%;
        margin: 20px 0;
        &__titre {
            text-align: center;
        }
        &__search {
            display: flex;
            align-items: center;
            background-color: #90A0FF;
            min-width: 250px;
            max-width: 400px;
            padding: 10px;
            margin: 15px auto;
            border: 5px groove #405080;
            border-radius: 10px;
            cursor: pointer;
            transition: all 300ms;
            &:hover, &:focus, &:active {
                background-color: #7080D0;
                border-color: #203060;
            }
        }
        &__avatar {
            background-color: #FFFFFF;
            margin: 0;
            img {
                height: 80px;
            }
        }
        &__identite {
            margin-left: 15px;
            line-height: 140%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
