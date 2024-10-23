<template>
    <div class="root" @keydown="handleKeydown" @dragover.prevent="handleDragover" @drop.prevent="handleDrop">
        <v-toolbar :color="multiSelect ? 'surface' : 'background'" :elevation="multiSelect ? 4 : 0">
            <template v-if="multiSelect">
                <v-btn icon="mdi-arrow-left" @click="deselectFiles"></v-btn>
                <v-toolbar-title>{{ `${selectedFilesCount} selected` }}</v-toolbar-title>
                <v-spacer />
                <v-btn icon="mdi-select-all" @click="selectAllFiles"></v-btn>
                <v-btn icon="mdi-pencil" :disabled="selectedFilesCount == 0"></v-btn>
                <v-btn icon="mdi-delete" :disabled="selectedFilesCount == 0" @click="confirmDeleteShowing = true"></v-btn>
            </template>

            <template v-else>
                <v-slide-group v-model="selectedTags" show-arrows multiple>
                    <v-slide-group-item v-for="tag in tags" :key="tag.id" v-slot="{ isSelected, toggle }">
                        <v-btn :variant="isSelected ? 'elevated' : 'outlined'" :prepend-icon="isSelected ? 'mdi-check' : undefined" class="ma-2 text-primary" flat rounded @click="toggle">
                            {{ tag.names.filter(x => x.lang == 'en')[0]?.name }}
                        </v-btn>
                    </v-slide-group-item>
                </v-slide-group>
                <v-spacer />
                <v-btn icon="mdi-check-all" @click="multiSelect = true; scrollContainer?.focus()"></v-btn>
            </template>
        </v-toolbar>

        <div ref="scrollContainer" class="scroll" tabindex="0" @scroll="handleScroll">
            <v-item-group v-model="selectedFiles" :multiple="multiSelect">
                <v-item v-for="(file, index) in files" :key="file.id" v-slot="{ isSelected, toggle }">
                    <v-card :class="{ selected: isSelected }" flat @click="handleItemClick($event, index, toggle)">
                        <div class="file-preview">
                            <img v-if="file.type == null || file.type.startsWith('image') || file.type.startsWith('video')" :src="axios.defaults.baseURL + `/files/${file.id}/thumb`" draggable="false"></img>
                            <v-icon v-else size="36">mdi-file-question</v-icon>
                        </div>
                        <v-icon v-if="isSelected" class="selectedIcon" color="secondary">mdi-check-circle</v-icon>
                    </v-card>
                </v-item>
            </v-item-group>
        </div>

        <input ref="uploadInput" type="file" multiple hidden @change="handleUploadInputChange">

        <v-speed-dial location="top right" transition="slide-y-reverse-transition">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="upload-btn" prepend-icon="mdi-upload" size="large" color="secondary" rounded v-bind="activatorProps">Upload</v-btn>
            </template>

            <v-btn key="1" prepend-icon="mdi-image" size="large" rounded @click="uploadInput!.accept = 'image/*'; uploadInput!.click()">Image</v-btn>
            <v-btn key="2" prepend-icon="mdi-format-size" size="large" rounded @click="uploadInput!.accept = 'text/*'; uploadInput!.click()">Text</v-btn>
            <v-btn key="3" prepend-icon="mdi-music" size="large" rounded @click="uploadInput!.accept = 'audio/*'; uploadInput!.click()">Music</v-btn>
            <v-btn key="3" prepend-icon="mdi-video" size="large" rounded @click="uploadInput!.accept = 'video/*'; uploadInput!.click()">Video</v-btn>
            <v-btn key="4" prepend-icon="mdi-file" size="large" rounded @click="uploadInput!.accept = '*'; uploadInput!.click()">Any files</v-btn>
        </v-speed-dial>

        <router-view :key="Date.now()" />
    </div>


    <v-overlay v-model="confirmDeleteShowing" class="align-center justify-center" min-width="280">
        <v-card title="Comfirmation" :text="`Delete the selected ${selectedFilesCount} ${selectedFilesCount == 1 ? 'file' : 'files'}?`">
            <template v-slot:actions>
                <v-spacer></v-spacer>
                <v-btn text="Cancel" @click="confirmDeleteShowing = false"></v-btn>
                <v-btn ref="confirmDeleteBtn" text="OK" color="red" @click="deleteFiles(); confirmDeleteShowing = false"></v-btn>
            </template>
        </v-card>
    </v-overlay>
</template>

<script setup lang="ts">
import { useUploadStore } from '@/stores/upload'
import { VBtn } from 'vuetify/components';

const multiSelect = ref(false)
const selectedFiles = ref<number[] | number | undefined>()
const selectedFilesCount = computed(() => typeof selectedFiles.value == 'object' ? selectedFiles.value.length : selectedFiles.value != null ? 1 : 0)
const selectedTags = ref<number[]>()

const files = ref<models.File[]>([])
const tags = ref<models.Tag[]>([])

const uploadStore = useUploadStore()

const scrollContainer = ref<HTMLElement>()
const uploadInput = ref<HTMLInputElement>()

const confirmDeleteBtn = ref<VBtn>()
const confirmDeleteShowing = ref(false)

let pauseLoad = false

onMounted(async () => {
    loadFiles()
    tags.value = await requests.getTags({ page: 0, pageSize: 6 })
})

watch(selectedFiles, () => {
    if (selectedFiles.value == null || (typeof selectedFiles.value == 'object' && selectedFiles.value.length == 0)) multiSelect.value = false
})

watch(confirmDeleteShowing, () => {
    confirmDeleteShowing.value ? nextTick(() => confirmDeleteBtn.value?.$el.focus()) : scrollContainer.value?.focus()
})

onBeforeRouteLeave(() => {
    if (multiSelect.value) {
        deselectFiles()
        return false
    }
})

async function loadFiles(fromId?: number) {
    deselectFiles()

    const f = await requests.getFiles({ fromId })
    files.value = fromId == null ? f : [...files.value, ...f]

    if (f.length > 0) {
        nextTick(() => {
            const el = scrollContainer.value!
            if (el.scrollHeight - el.clientHeight < 200) {
                loadFiles(files.value[files.value.length - 1].id - 1)
            }
        })
    }
}

async function handleScroll() {
    if (pauseLoad) return

    const el = scrollContainer.value!
    const toBottom = el.scrollHeight - el.clientHeight - el.scrollTop

    if (toBottom < 160) {
        pauseLoad = true
        setTimeout(() => pauseLoad = false, 1000);

        const newFiles = await requests.getFiles({ fromId: files.value[files.value.length - 1].id - 1 })
        files.value = [...files.value, ...newFiles]

        if (newFiles.length > 0) pauseLoad = false
    }
}

function deselectFiles() {
    selectedFiles.value = undefined
    multiSelect.value = false
}

function selectAllFiles() {
    multiSelect.value = true
    selectedFiles.value = [...Array(files.value.length).keys()]
}

function handleItemClick(e: PointerEvent, i: number, toggle?: (() => void)) {
    if (e.ctrlKey || (e.shiftKey && selectedFiles.value == null)) {
        multiSelect.value = true
        nextTick(() => {
            toggle && toggle()
        })
    }

    else if (e.shiftKey && selectedFiles.value != null) {
        let start = typeof selectedFiles.value == 'object' ? selectedFiles.value[0] : selectedFiles.value
        let end = i
        selectedFiles.value = []
        if (start <= end)
            for (let j = start; j <= end; j++) {
                selectedFiles.value.push(j)
            }
        else
            for (let j = start; j >= end; j--) {
                selectedFiles.value.push(j)
            }
    }

    else if (multiSelect.value) toggle && toggle()

    else router.push(`/files/${files.value[i].id}`)

    window.lastClickedElement = e.target as HTMLElement
}

function handleKeydown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key == 'a') {
        e.preventDefault()
        selectAllFiles()
    }
    if (e.key == 'Escape') deselectFiles()
    if (e.key == 'Delete') confirmDeleteShowing.value = true
}

function handleDragover(e: DragEvent) {
    e.dataTransfer && (e.dataTransfer.dropEffect = "move")
}

function handleDrop(e: DragEvent) {
    confirmUpload(e.dataTransfer?.files)
}

function handleUploadInputChange(params: any) {
    confirmUpload(uploadInput.value?.files)
}

async function confirmUpload(fileList?: FileList | null) {
    if (fileList) {
        await uploadStore.createUploadTask(Array.from(fileList))
        loadFiles()
    }
}

async function deleteFiles() {
    if (typeof selectedFiles.value == 'object') {
        await Promise.all(selectedFiles.value.map(i => requests.deleteFile(files.value[i].id)))
    } else if (selectedFiles.value != null) {
        await requests.deleteFile(files.value[selectedFiles.value].id)
    }
    loadFiles()
}
</script>

<style scoped lang="scss">
.root {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}

.v-toolbar {
    z-index: 999;
    transition: background-color 0.2s, box-shadow 0.2s;
}

.scroll {
    flex: 1;
    overflow: auto;
}

.v-item-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px;
    user-select: none;

    .v-card {
        display: inline-block;
        min-width: 150px;
        height: 200px;

        .file-preview {
            width: 100%;
            height: 100%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            transition: transform 0.1s, border-radius 0.1s;
        }

        img {
            min-width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .v-card.selected {
        .file-preview {
            transform: scale(0.9);
            border-radius: 8px;
        }

        .selectedIcon {
            position: absolute;
            top: 4px;
            left: 4px;
            background-color: white;
            border-radius: 100%;
        }
    }
}

.upload-btn {
    position: absolute;
    right: 32px;
    bottom: 36px;
}

@media (max-width: 500px) {
    .v-item-group .v-card {
        width: calc(50vw - 12px);
        height: calc(50vw - 12px);

        img {
            width: 100%;
        }
    }
}
</style>