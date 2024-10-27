<template>
    <h1>Settings</h1>

    <v-btn @click="requests.deleteThumbs()">Clear thumb cache</v-btn>
    <br><br>

    <FileScan />
</template>

<script setup lang="ts">
import FileScan from "@/components/FileScan.vue";

</script>
