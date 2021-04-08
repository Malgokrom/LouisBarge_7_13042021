<template>
    <router-view />
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="scss">
    html, body {
        height: 100%;
    }
    body {
        background-color: #C0C0C0;
        margin: 0;
    }
    #app {
        height: 100%;
        > div {
            display: flex;
            flex-direction: column;
            height: 100%;
            main {
                flex-grow: 1;
            }
        }
    }
    h1 {
        text-align: center;
    }
</style>
