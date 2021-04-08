<template>
    <div class="profil">
        <Vheader />
        <main>
            <h1>Gestion du profil</h1>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'Profil',
        components: { Vheader, Vfooter }
    }
</script>

<style scoped lang="scss">

</style>
