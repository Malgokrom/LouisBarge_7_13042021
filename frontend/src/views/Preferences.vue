<template>
    <div class="preferences">
        <Vheader />
        <main>
            <h1>Préférences</h1>
            <table>
                <tr>
                    <td>Texte&nbsp;:</td>
                    <td>
                        <select v-model="preferences.texte" @change="changeTexte(preferences.texte)">
                            <option value="80%">petit</option>
                            <option value="100%" selected>moyen</option>
                            <option value="120%">grand</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Police&nbsp;:</td>
                    <td>
                        <select v-model="preferences.police" @change="changePolice(preferences.police)">
                            <option value="roboto" selected>Roboto</option>
                            <option value="g731">G731</option>
                        </select>
                    </td>
                </tr>
            </table>
            <button @click="sauvegarder">Sauvegarder</button>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import axios from 'axios';

    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'Preferences',
        components: { Vheader, Vfooter },
        data() {
            return {
                body: document.getElementsByTagName('body')[0],
                preferences: {
                    texte: this.$store.state.preferences.texte,
                    police: this.$store.state.preferences.police
                }
            }
        },
        methods: {
            sauvegarder() {
                axios.put(this.$store.state.url_api + '/user/preferences', {
                    user_id: this.$store.state.user.id,
                    user_status: this.$store.state.user.status,
                    ...this.preferences
                }, this.$store.getters.axiosDefautConfig)
                .then((response) => {
                    alert(response.data.message);
                })
                .catch((error) => {
                    alert(error.response.data.message);
                });
            },
            changeTexte(texte) {
                this.body.style.fontSize = texte;
                this.$store.commit('preferencesTexte', texte);
            },
            changePolice(police) {
                this.body.style.fontFamily = police;
                this.$store.commit('preferencesPolice', police);
            }
        }
    }
</script>

<style scoped lang="scss">
    table {
        tr {
            td {
                padding: 5px;
            }
            td:nth-child(1) {
                text-align: right;
            }
        }
    }
    button {
        display: block;
        background-color: #003070;
        color: #FFFFFF;
        font-weight: bold;
        margin-top: 20px;
        padding: 15px 30px;
        border: 3px groove #0056ad;
        border-radius: 15px;
        cursor: pointer;
        outline: none;
        transition: all 300ms;
        &:hover, &:focus, &:active {
            background-color: #005090;
        }
    }
</style>
