<template>
    <div class="membre">
        <Vheader />
        <main>
            <h1>Page de présentation du membre : {{ $route.params.id }}</h1>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'Membre',
        components: { Vheader, Vfooter }
    }
</script>

<style scoped lang="scss">

</style>
