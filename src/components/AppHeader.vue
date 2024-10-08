<template>
    <v-app-bar>
        <v-toolbar-title>Archive of Madoka Magica</v-toolbar-title>

        <v-text-field v-if="$vuetify.display.mdAndUp" class="center-search-input" v-model="search" label="Search" prepend-inner-icon="mdi-magnify" single-line hide-details clearable />
        <v-btn v-else icon="mdi-magnify"></v-btn>

        <v-btn v-if="uploadQueue.length > 0" id="upload-btn" icon="mdi-upload"></v-btn>

        <v-btn id="user-btn" :class="{ 'big-user-btn': $vuetify.display.mdAndUp }" :icon="!$vuetify.display.mdAndUp" rounded="pill">
            <v-avatar :image="'https://haojiezhe12345.top:82/madohomu/api/data/images/avatars/' + user.avatar" size="32" />
            <span v-if="$vuetify.display.mdAndUp">{{ user.name }}</span>
        </v-btn>

        <v-menu activator="#upload-btn" v-model="uploadStore.uploadShowing" :close-on-content-click="false">
            <v-card color="background">
                <h4>Uploading</h4>

                <v-list bg-color="background" max-height="60vh">
                    <v-list-item v-for="file in uploadQueue" @click="file.id != null && (router.push(`/files/${file.id}`), uploadStore.uploadShowing = false)">
                        <template v-slot:prepend>
                            <v-avatar v-if="file.fileDataURL" :image="file.fileDataURL" rounded></v-avatar>
                            <v-avatar v-else>
                                <v-icon>mdi-file</v-icon>
                            </v-avatar>
                        </template>

                        <v-list-item-title>{{ file.file.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                            {{
                                file.status == TaskFileStatus.Uploading
                                    ? file.progress != null
                                        ? `${file.status}: ${file.progress}%`
                                        : TaskFileStatus.Pending
                                    : file.status == TaskFileStatus.Failed
                                        ? `${file.status} - ${file.message}`
                                        : file.status
                            }}
                        </v-list-item-subtitle>

                        <template v-slot:append>
                            <v-btn v-if="file.status == TaskFileStatus.OK" icon="mdi-open-in-new" variant="text"></v-btn>
                            <v-btn v-else icon="mdi-close" variant="text"></v-btn>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>

        <v-menu activator="#user-btn">
            <v-list bg-color="background" max-height="60vh">
                <v-list-item append-icon="mdi-open-in-new" @click="gotoUser">User profile</v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useUploadStore, TaskFileStatus } from '@/stores/upload'
import router from '@/router';

const user = useUserStore().user
const uploadStore = useUploadStore()

const uploadQueue = computed(() => uploadStore.tasks.flatMap(x => x.files).reverse())

const search = ref('')

function gotoUser() {
    if (location.pathname != '/') window.open(user.id ? '/#popup-userHome' : '/#popup-loginPopup')
}
</script>

<style scoped lang="scss">
.center-search-input {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40vw;
    max-width: 600px;
}

.big-user-btn {
    padding: 6px 8px;
    box-sizing: content-box;

    span {
        margin-left: 8px;
    }
}

.v-menu {
    h4 {
        padding: 14px 16px 4px;
    }
}
</style>