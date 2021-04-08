<template>
    <div class="preferences">
        <Vheader />
        <main>
            <h1>Préférences</h1>
        </main>
        <Vfooter />
    </div>
</template>

<script>
    import Vheader from '@/components/Vheader.vue';
    import Vfooter from '@/components/Vfooter.vue';

    export default {
        name: 'Preferences',
        components: { Vheader, Vfooter }
    }
</script>

<style scoped lang="scss">

</style>
