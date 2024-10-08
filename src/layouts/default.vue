<template>
    <v-app>
        <AppHeader />

        <AppNavigation />

        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts" setup>

</script>

<style>
.v-application,
.v-application__wrap {
    display: block !important;
    height: 100% !important;
    min-height: initial !important;
}

.v-main {
    height: 100%;
    overflow: auto;
}
</style>