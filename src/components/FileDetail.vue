<template>
    <div ref="root" class="root bg-background" tabindex="0" @keydown="handleKeydown">
        <v-card v-if="fileDetail != null" color="background" flat>
            <v-card-item :style="{ padding: editMode ? '10px 4px' : '10px 4px 2px 16px' }" :class="{ 'bg-surface': editMode }">
                <template v-if="editMode" v-slot:prepend>
                    <v-btn ref="cancelEditBtn" icon="mdi-arrow-left" variant="text" @click="editMode = false"></v-btn>
                </template>

                <template v-slot:append>
                    <v-btn v-if="editMode" icon="mdi-check" variant="text" @click="editMode = false"></v-btn>
                    <v-btn v-else ref="enterEditBtn" icon="mdi-pencil" variant="text" @click="editMode = true" style="margin-top: -8px;"></v-btn>
                </template>

                <template v-if="editMode">
                    <v-card-title>Edit "{{ fileDetail.title || 'Untitled' }}"</v-card-title>
                </template>

                <template v-else>
                    <v-card-title>{{ fileDetail.title || 'Untitled' }}</v-card-title>
                    <v-card-subtitle>{{ fileDetail.description || 'No description' }}</v-card-subtitle>
                </template>
            </v-card-item>

            <v-list bg-color="background">
                <template v-if="editMode">
                    <v-list-item><v-text-field v-model="fileDetail.title" label="Title" hide-details></v-text-field></v-list-item>
                    <v-list-item><v-textarea v-model="fileDetail.description" label="Description"></v-textarea></v-list-item>
                </template>

                <template v-else>
                    <v-list-item v-if="fileDetail.width && fileDetail.height" prepend-icon="mdi-image-size-select-large" title="Dimension" :subtitle="`${fileDetail.width} x ${fileDetail.height}`"></v-list-item>
                    <v-list-item prepend-icon="mdi-file-outline" title="Size" :subtitle="utils.getFileSize(fileDetail.size)"></v-list-item>
                    <v-list-item>{{ fileDetail }}</v-list-item>
                </template>
            </v-list>
        </v-card>

        <div v-else class="loading-circle">
            <v-progress-circular color="secondary" indeterminate></v-progress-circular>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VBtn } from 'vuetify/components';

const props = defineProps<{
    fileIds: number[]
    edit?: boolean
}>()

const cancelEditBtn = ref<VBtn>()
const enterEditBtn = ref<VBtn>()

const fileDetail = ref<models.File>()

const editMode = ref(Boolean(props.edit))

watch(editMode, () => {
    nextTick(() => {
        if (editMode.value) {
            cancelEditBtn.value?.$el.focus()
        } else {
            enterEditBtn.value?.$el.focus()
        }
    })
})

onMounted(async () => {
    fileDetail.value = await requests.getFileDeatil(props.fileIds[0])
})

function handleKeydown(e: KeyboardEvent) {
    if (e.key == 'Escape') {
        if (editMode.value) {
            e.stopPropagation()
            editMode.value = false
        }
    }
}
</script>

<style>
.root {
    position: relative;
    height: 100%;
}

.v-card-item {
    transition: background-color 0.2s;
}

.loading-circle {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
}
</style>