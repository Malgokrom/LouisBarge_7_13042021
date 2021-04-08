<template>
    <div class="reglement">
        <Vheader />
        <main>
            <h1>Règlement</h1>
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

</style>
