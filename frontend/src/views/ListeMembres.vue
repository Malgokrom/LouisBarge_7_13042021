<template>
    <div class="liste-membres">
        <Vheader />
        <main>
            <h1>Liste des membres</h1>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'ListeMembres',
        components: { Vheader, Vfooter }
    }
</script>

<style scoped lang="scss">

</style>
