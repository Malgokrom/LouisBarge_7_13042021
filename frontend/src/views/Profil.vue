<template>
    <div class="profil">
        <Vheader />
        <main>
            <h1>Gestion du profil</h1>
            <figure>
                <img :src="$store.getters.getPathAvatar" alt="Votre avatar" />
            </figure>
            <form>
                <!-- Ajouter l'image -->
                <div>
                    <label for="nom">Nom :</label><br />
                    <input type="text" id="nom" :placeholder="$store.state.user.nom" v-model="nom" />
                </div>
                <div>
                    <label for="prenom">Prénom :</label><br />
                    <input type="text" id="prenom" :placeholder="$store.state.user.prenom"  v-model="prenom" />
                </div>
                <div>
                    <label for="email">Email :</label><br />
                    <input type="email" id="email" :placeholder="$store.state.user.email" v-model="email" />
                </div>
                <div>
                    <label for="mdp">Mot de passe</label><br />
                    <input type="password" id="mdp" placeholder="Nouveau mot de passe" v-model="new_mdp" /><br />
                    <input type="password" id="mdp2" placeholder="Nouveau mot de passe" v-model="new_mdp2" />
                </div>
                <div>
                    <label for="description">Description :</label><br />
                    <textarea id="description" v-model="description"></textarea>
                </div>
                <div>
                    <input type="checkbox" id="supprimer" v-model="supprimer" />
                    <label for="supprimer">Supprimer votre compte</label>
                </div>
                <div>
                    <label id="label-confirm" for="confirm">Confirmation</label>
                    <input type="password" id="confirm" placeholder="Mot de passe actuel" v-model="old_mdp" required />
                </div>
                <button type="submit" @click.prevent="enregistrer">Enregistrer</button>
            </form>
            <div class="messages">
                <p v-show="!ok_nom">Le nom doit faire entre 1 et 64 caractères et peut contenir des lettres, des tirets et des espaces.</p>
                <p v-show="!ok_prenom">Le prénom doit faire entre 1 et 64 caractères et peut contenir des lettres, des tirets et des espaces.</p>
                <p v-show="!ok_email">Veuillez saisir une adresse email valide.</p>
                <p v-show="!ok_new_mdp">Le mot de passe doit faire entre 8 et 64 caractères.</p>
                <p v-show="!ok_new_mdp2">Le mot de passe a été mal recopié.</p>
                <p v-show="message_serveur">{{ message_serveur }}</p>
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
        name: 'Profil',
        components: { Vheader, Vfooter },
        data() {
            return {
                nom: '',
                prenom: '',
                email: '',
                new_mdp: '',
                new_mdp2: '',
                description: '',
                supprimer: false,
                old_mdp: '',
                ok_nom: true,
                ok_prenom: true,
                ok_email: true,
                ok_new_mdp: true,
                ok_new_mdp2: true,
                regex_nom: /^[-a-zA-ZœçàâäéèêëîïôöùûüŷÿŒÇÀÂÄÉÈÊËÎÏÔÖÙÛÜŶŸ\s]{1,64}$/,
                regex_email: /^[-._a-zA-Z0-9]+@[-._a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/,
                regex_mdp: /^.{8,64}$/,
                message_serveur: false
            }
        },
        methods: {
            enregistrer() {
                this.message_serveur = false;
                this.ok_nom = this.regex_nom.test(this.nom) || !this.nom;
                this.ok_prenom = this.regex_nom.test(this.prenom) || !this.prenom;
                this.ok_email = this.regex_email.test(this.email) || !this.email;
                this.ok_new_mdp = this.regex_mdp.test(this.new_mdp) || !this.new_mdp;
                this.ok_new_mdp2 = this.new_mdp === this.new_mdp2;
                if (this.ok_nom && this.ok_prenom && this.ok_email && this.ok_new_mdp && this.ok_new_mdp2) {
                    axios.put(this.$store.state.url_api + '/user/update', {
                        user_id: this.$store.state.user.id,
                        user_status: this.$store.state.user.status,
                        nom: this.nom,
                        prenom: this.prenom,
                        email: this.email,
                        new_mdp: this.new_mdp,
                        description: this.description,
                        supprimer: this.supprimer,
                        old_mdp: this.old_mdp
                    }, this.$store.getters.axiosDefautConfig)
                    .then((response) => {
                        alert(response.data.message);
                        if (this.supprimer) {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            this.$store.commit('setUser', null);
                            this.$store.commit('setToken', null);
                            this.$router.push('/');
                        }
                        if (localStorage.getItem('user')) { localStorage.setItem('user', JSON.stringify(response.data.user)); }
                        this.$store.commit('setUser', response.data.user);
                    })
                    .catch((error) => {
                        this.message_serveur = error.response.data.message;
                    });
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    figure {
        max-width: 100%;
        img {
            width: 100%;
        }
    }
    form {
        div {
            margin: 10px 0;
            label {
                position: relative;
                bottom: 3px;
            }
            input {
                padding: 5px;
                border: 3px groove #808080;
                border-radius: 8px;
                outline: none;
                &:focus {
                    border-color: #0056AD;
                }
            }
            textarea {
                font-size: 1.2em;
                width: 100%;
                height: 150px;
            }
        }
        button {
            display: block;
            background-color: #003070;
            color: #FFFFFF;
            font-weight: bold;
            width: 100%;
            margin: 30px auto;
            padding: 15px 30px;;
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
    #mdp {
        border-bottom-width: 2px;
        border-radius: 8px 8px 0 0;
    }
    #mdp2 {
        border-top-width: 2px;
        border-radius: 0 0 8px 8px;
    }
    #label-confirm {
        display: block;
        font-weight: bold;
        font-size: 1.2em;
        text-align: center;
    }
</style>
