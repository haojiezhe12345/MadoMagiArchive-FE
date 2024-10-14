<template>
    <v-app>
        <AppHeader />

        <AppNavigation />

        <v-main>
            <router-view />
        </v-main>

        <v-snackbar v-model="rootSnackbar.showing" :timeout="rootSnackbar.timeout">
            {{ rootSnackbar.text }}
            <template v-slot:actions v-if="rootSnackbar.text_close">
                <v-btn variant="text" @click="rootSnackbar.close()">{{ rootSnackbar.text_close }}</v-btn>
            </template>
        </v-snackbar>
    </v-app>
</template>

<script lang="ts" setup>
import { rootSnackbar } from "@/utils";
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