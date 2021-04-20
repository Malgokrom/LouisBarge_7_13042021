<template>
    <div class="reglement">
        <Vheader />
        <main>
            <h1>Règlement</h1>
            <div>
                <div class="part-1">
                    <h2>Respect des employés</h2>
                    <ul>
                        <li>Ne divulguez pas d'informations sur la vie privée d'un autre employé sans son autorisation.</li>
                        <li>Ne postez pas d'insultes, de menaces, ou d'incitation à la haine.</li>
                        <li>Les images de violence et de pornographie sont interdites.</li>
                    </ul>
                </div>
                <div class="part-2">
                    <h2>Fonctionnement de l'application</h2>
                    <ul>
                        <li>Si vous découvrez une faille dans le code, vous êtes prié de la signaler.</li>
                        <li>Si vous trouvez un appareil sans surveillance connecté à l'application, vous devez le déconnecter.</li>
                    </ul>
                </div>
                <div class="part-3">
                    <h2>Modérateurs</h2>
                    <ul>
                        <li>Les modérateurs sont nommés par le compte administrateur.</li>
                        <li>Si vous êtes modérateur, usez de votre autorité judicieusement.</li>
                    </ul>
                </div>
            </div>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'Reglement',
        components: { Vheader, Vfooter }
    }
</script>

<style scoped lang="scss">
    h1 {
        margin-bottom: 0;
    }
    ul {
        padding-left: 10px;
        margin-bottom: 30px;
        li {
            margin: 10px;
        }
    }
</style>
