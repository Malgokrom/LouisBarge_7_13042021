<template>
    <div class="preferences">
        <Vheader />
        <main>
            <h1>Préférences</h1>
            <table>
                <tr>
                    <td>Texte :</td>
                    <td>
                        <select v-model="preferences.texte" @change="changeTexte(preferences.texte)">
                            <option value="80%">petit</option>
                            <option value="100%" selected>moyen</option>
                            <option value="120%">grand</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Police :</td>
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

</style>
