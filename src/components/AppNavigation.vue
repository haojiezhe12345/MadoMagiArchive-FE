<template>
    <v-navigation-drawer v-if="!$vuetify.display.mobile" width="96">
        <v-list>
            <v-list-item v-for="item in navLinks" class="left-nav-item">
                <v-btn class="left-nav-btn" :to="item.target" stacked flat>
                    <v-icon>{{ item.icon }}</v-icon>
                    <span>{{ item.title }}</span>
                </v-btn>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-bottom-navigation v-else>
        <v-btn v-for="item in navLinks" class="bottom-nav-btn" :to="item.target">
            <v-icon>{{ item.icon }}</v-icon>
            <span>{{ item.title }}</span>
        </v-btn>
    </v-bottom-navigation>
</template>

<script setup lang="ts">
const navLinks = ref([
    {
        title: 'Home',
        icon: 'mdi-home',
        target: '/',
    },
    {
        title: 'Files',
        icon: 'mdi-folder',
        target: '/files',
    },
    {
        title: 'Tags',
        icon: 'mdi-shape',
        target: '/tags',
    },
    {
        title: 'Settings',
        icon: 'mdi-cog',
        target: '/settings',
    },
])
</script>

<style scoped>
.left-nav-item {
    padding: 0 !important;
}

.left-nav-btn {
    width: 100%;
}

.bottom-nav-btn {
    flex: 1;
}
</style>