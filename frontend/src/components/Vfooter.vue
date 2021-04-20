<template>
    <div class="vfooter">
        <figure>
            <img src="../assets/logos/icon_white.svg" alt="Logo" />
        </figure>
        <div>
            Groupomania 2021<br />
            Tous droits réservés
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Vfooter'
    }
</script>

<style scoped lang="scss">
    .vfooter {
        display: flex;
        justify-content: center;
        background-color: #002090;
        color: #FFFFFF;
        font-weight: bold;
        text-align: center;
        padding: 20px;
        border-top: 5px solid #404080;
        figure {
            height: 100%;
            margin: 0;
            padding-right: 10px;
            img {
                height: 100%;
                width: 40px;
            }
        }
    }
</style>
