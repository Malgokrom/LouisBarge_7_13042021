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
                display: flex;
                flex-direction: column;
                align-items: center;
                flex-grow: 1;
                padding: 0 20px;
            }
        }
    }
    h1 {
        text-align: center;
    }
    form {
        margin: 20px 0;
    }
</style>
