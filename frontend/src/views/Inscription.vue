<template>
    <div class="inscription">
        <h1>Inscription</h1>
        <form>
            <input type="text" placeholder="nom" v-model="nom" /><br />
            <input type="text" placeholder="prénom" v-model="prenom" /><br />
            <input type="email" placeholder="email" v-model="email" /><br />
            <input type="password" placeholder="mot de passe" v-model="mdp" /><br />
            <input type="password" placeholder="mot de passe" v-model="mdp2" /><br />
            <button type="submit" @click="envoyer">S'inscrire</button>
        </form>
        <p>
            Vous avez déjà un compte ?<br />
            <router-link to="/">Connectez-vous ici.</router-link>
        </p>
        <p v-show="!ok_nom">
            Le nom doit faire entre 1 et 64 caractères et peut contenir des lettres, des tirets et des espaces.
        </p>
        <p v-show="!ok_prenom">
            Le prénom doit faire entre 1 et 64 caractères et peut contenir des lettres, des tirets et des espaces.
        </p>
        <p v-show="!ok_email">
            Veuillez saisir une adresse email valide.
        </p>
        <p v-show="!ok_mdp">
            Le mot de passe doit faire entre 8 et 64 caractères.
        </p>
        <p v-show="!ok_mdp2">
            Le mot de passe a été mal recopié.
        </p>
        <p v-show="message_serveur">
            {{ message_serveur }}
        </p>
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
            envoyer(e) {
                e.preventDefault();
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
                    }).then((response) => {
                        alert(response.data.message);
                        this.$router.push('/');
                    }).catch((error) => {
                        this.message_serveur = error.response.data.message;
                    });
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .inscription {
        text-align: center;
    }
</style>
