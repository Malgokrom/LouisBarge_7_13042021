<template>
    <div class="inscription">
        <figure class="inscription__logo">
            <img src="../assets/logos/icon_blue.svg" alt="Logo" />
        </figure>
        <h1 class="inscription__titre">Inscription</h1>
        <form class="inscription__form">
            <div>
                <label for="nom">Nom :</label><br />
                <input type="text" id="nom" placeholder="nom" title="[1-64] : lettres, tiret" v-model="nom" />
            </div>
            <div>
                <label for="prenom">Prénom :</label><br />
                <input type="text" id="prenom" placeholder="prénom" title="[1-64] : lettres, tiret" v-model="prenom" />
            </div>
            <div>
                <label for="email">Email :</label><br />
                <input type="email" id="email" placeholder="email" v-model="email" />
            </div>
            <div>
                <label for="mdp">Mot de passe :</label><br />
                <input type="password" id="mdp" placeholder="mot de passe" title="[8-64]" v-model="mdp" /><br />
                <input type="password" id="mdp2" placeholder="confirmation" title="[8-64]" v-model="mdp2" />
            </div>
            <button type="submit" @click.prevent="envoyer">S'inscrire</button>
        </form>
        <div class="inscription__lien">
            Vous avez déjà un compte ?<br />
            <router-link to="/">Connectez-vous ici.</router-link>
        </div>
        <div class="inscription__messages">
            <p v-show="!ok_nom">Le nom doit faire entre 1 et 64 caractères et peut contenir des lettres, des tirets et des espaces.</p>
            <p v-show="!ok_prenom">Le prénom doit faire entre 1 et 64 caractères et peut contenir des lettres, des tirets et des espaces.</p>
            <p v-show="!ok_email">Veuillez saisir une adresse email valide.</p>
            <p v-show="!ok_mdp">Le mot de passe doit faire entre 8 et 64 caractères.</p>
            <p v-show="!ok_mdp2">Le mot de passe a été mal recopié.</p>
            <p v-show="message_serveur">{{ message_serveur }}</p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'Inscription',
        data() {
            return {
                nom: '',
                prenom: '',
                email: '',
                mdp: '',
                mdp2: '',
                ok_nom: true,
                ok_prenom: true,
                ok_email: true,
                ok_mdp: true,
                ok_mdp2: true,
                regex_nom: /^[-a-zA-ZœçàâäéèêëîïôöùûüŷÿŒÇÀÂÄÉÈÊËÎÏÔÖÙÛÜŶŸ\s]{1,64}$/,
                regex_email: /^[-._a-zA-Z0-9]+@[-._a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/,
                regex_mdp: /^.{8,64}$/,
                message_serveur: false
            }
        },
        methods: {
            envoyer() {
                this.message_serveur = false;
                this.ok_nom = this.regex_nom.test(this.nom);
                this.ok_prenom = this.regex_nom.test(this.prenom);
                this.ok_email = this.regex_email.test(this.email);
                this.ok_mdp = this.regex_mdp.test(this.mdp);
                this.ok_mdp2 = this.mdp === this.mdp2;
                if (this.ok_nom && this.ok_prenom && this.ok_email && this.ok_mdp && this.ok_mdp2) {
                    axios.post(this.$store.state.url_api + '/user/signup', {
                        nom: this.nom,
                        prenom: this.prenom,
                        email: this.email,
                        mdp: this.mdp
                    })
                    .then((response) => {
                        alert(response.data.message);
                        this.$router.push('/');
                    })
                    .catch((error) => {
                        this.message_serveur = error.response.data.message;
                    });
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .inscription {
        padding: 20px;
        &__logo {
            height: 100px;
            margin: 0 auto;
            img {
                height: 100%;
            }
        }
        &__titre {
            text-align: center;
            margin: 0 0 10px 0;
        }
        &__form {
            margin: 0 auto;
            div {
                margin: 10px 0;
                label {
                    position: relative;
                    bottom: 3px;
                }
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
            button {
                display: block;
                background-color: #003070;
                color: #FFFFFF;
                font-weight: bold;
                width: 100%;
                margin-top: 20px;
                padding: 10px;
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
        &__lien {
            text-align: center;
            margin-top: 20px;
            a {
                color: #0000FF;
                font-weight: bold;
                text-decoration: none;
                transition: all 300ms;
                &:hover, &:active {
                    color: #0040FF;
                    font-style: italic;
                }
            }
        }
        &__messages {
            color: #FF0000;
            font-weight: bold;
            margin: 0 auto;
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
</style>
