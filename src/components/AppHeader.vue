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

        <v-menu activator="#user-btn" :close-on-content-click="false">
            <v-card class="user-card" color="background">
                <v-card-item>
                    <div class="user-detail">
                        <v-avatar :image="'https://haojiezhe12345.top:82/madohomu/api/data/images/avatars/' + user.avatar" size="64" />

                        <div v-if="userLoggedIn">{{ user.name }}<span style="color: #666"> (UID: {{ user.id }})</span></div>
                        <div v-else>Not logged in</div>

                        <v-row>
                            <v-col>
                                <div>Read</div>
                                <div>Lv.{{ user.accessLevel != null ? user.accessLevel & 0x00ff0000 / 0x10000 : '' }}</div>
                            </v-col>
                            <v-col>
                                <div>Write</div>
                                <div>Lv.{{ user.accessLevel != null ? user.accessLevel & 0x0000ff00 / 0x100 : '' }}</div>
                            </v-col>
                            <v-col>
                                <div>Delete</div>
                                <div>Lv.{{ user.accessLevel != null ? user.accessLevel & 0x000000ff : '' }}</div>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-item>

                <template v-slot:actions>
                    <v-spacer />
                    <v-btn prepend-icon="mdi-account" append-icon="mdi-open-in-new" rounded @click="gotoUser">
                        <template v-if="userLoggedIn">MadoHomu.love Account</template>
                        <template v-else>Log in through MadoHomu.love</template>
                    </v-btn>
                    <v-spacer />
                </template>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { useUploadStore, TaskFileStatus } from '@/stores/upload'

const user = useUserStore().user
const userLoggedIn = useUserStore().userLoggedIn

const uploadStore = useUploadStore()
const uploadQueue = computed(() => uploadStore.tasks.flatMap(x => x.files).reverse())

const search = ref('')

function gotoUser() {
    let base = location.hostname.includes('haojiezhe12345.top') ? '/madohomu/' : '/'
    if (location.pathname != '/') window.open(base + (userLoggedIn ? '#popup-userHome' : '#popup-loginPopup'))
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

.user-card {
    .user-detail {
        display: flex;
        flex-direction: column;
        align-items: center;

        .v-avatar {
            margin: 8px 0;
        }

        .v-row {
            margin-top: 0;
        }

        .v-col {
            text-align: center;
        }
    }
}
</style>