<template>
    <router-view />
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="scss">
    @font-face {
        font-family: "roboto";
        src: url("../public/polices//Roboto-Regular.ttf");
    }
    @font-face {
        font-family: "hopalong";
        src: url("../public/polices/Hopalong-bold.ttf");
    }
    @font-face {
        font-family: "karin";
        src: url("../public/polices/Karin-regular.ttf");
    }
    @font-face {
        font-family: "g731";
        src: url("../public/polices/G731-script-regular.ttf");
    }
    * {
        box-sizing: border-box;
    }
    html, body {
        height: 100%;
    }
    body {
        background-color: #D0D0FF;
        font-family: "roboto";
        margin: 0;
    }
    figure {
        line-height: 0;
    }
    #app {
        height: 100%;
        > div {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        main {
            display: flex;
            flex-direction: column;
            background-color: #90E0E0;
            align-items: center;
            flex-grow: 1;
            padding: 0 20px;
        }
    }
</style>
