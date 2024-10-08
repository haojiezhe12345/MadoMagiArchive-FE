<template>
    <div class="file-view">
        <div ref="fileContentDiv" class="file-content">
            <v-progress-linear v-if="loading" indeterminate color="secondary"></v-progress-linear>
            <v-btn class="back-btn" variant="text" icon="mdi-arrow-left" @click="router.back()"></v-btn>

            <div class="img-container">
                <img ref="imgElement" :src="axios.defaults.baseURL + `/files/${fileId}`" draggable="false"></img>
                <img ref="previewImg" draggable="false">
            </div>
        </div>

        <div class="file-detail">
            {{ fileDetail }}
        </div>
    </div>
</template>

<script setup lang="ts">
import * as requests from '@/requests'
import router from '@/router'

const route = useRoute()
// @ts-ignore
const fileId = route.params.id

const fileContentDiv = ref<HTMLDivElement>()
const imgElement = ref<HTMLImageElement>()
const previewImg = ref<HTMLImageElement>()

const loading = ref(false)

const fileDetail = ref<requests.FileItem>()

onMounted(async () => {
    fileDetail.value = await requests.getFileDeatil(fileId)
})

nextTick(() => {
    if (fileContentDiv.value && imgElement.value && previewImg.value && window.lastClickedElement && 'src' in window.lastClickedElement) {
        imgElement.value.style.display = 'none'
        previewImg.value.style.display = 'block'
        previewImg.value.src = window.lastClickedElement.src
        loading.value = true

        const rect0 = window.lastClickedElement.getBoundingClientRect()
        fileContentDiv.value.style.setProperty('--from-top', `${rect0.top}px`)
        fileContentDiv.value.style.setProperty('--from-left', `${rect0.left}px`)
        fileContentDiv.value.style.setProperty('--from-right', `${window.innerWidth - rect0.right}px`)
        fileContentDiv.value.style.setProperty('--from-bottom', `${window.innerHeight - rect0.bottom}px`)

        const rect1 = fileContentDiv.value.getBoundingClientRect()
        fileContentDiv.value.style.setProperty('--to-top', `${rect1.top}px`)
        fileContentDiv.value.style.setProperty('--to-left', `${rect1.left}px`)
        fileContentDiv.value.style.setProperty('--to-right', `${window.innerWidth - rect1.right}px`)
        fileContentDiv.value.style.setProperty('--to-bottom', `${window.innerHeight - rect1.bottom}px`)

        imgElement.value.addEventListener('load', () => loading.value = false)
        setTimeout(() => {
            loading.value
                ? imgElement.value!.addEventListener('load', showFullImage)
                : showFullImage()
        }, 200);

        window.lastClickedElement = null
    }
    else {
        showFullImage()
    }
})

function showFullImage() {
    imgElement.value!.style.display = 'block'
    previewImg.value!.style.display = 'none'
}

</script>

<style scoped lang="scss">
.file-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    display: flex;
    background-color: white;
    overflow: hidden;
    animation: bg-show 0.2s;
}

@keyframes bg-show {
    from {
        background-color: rgba(255, 255, 255, 0);
    }

    to {
        background-color: rgba(255, 255, 255, 255);
    }
}

.file-content {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    overflow: hidden;

    .v-progress-linear {
        position: absolute;
        z-index: 1000;
    }

    .back-btn {
        position: absolute;
        top: 8px;
        left: 4px;
        z-index: 1000;
        animation: fadein 0.2s;
    }
}

@keyframes fadein {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.img-container {
    box-sizing: border-box;
    padding: 24px;
    animation: img-zoom 0.2s;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

@keyframes img-zoom {
    from {
        position: fixed;
        top: var(--from-top);
        left: var(--from-left);
        right: var(--from-right);
        bottom: var(--from-bottom);
        padding: 0;
    }

    to {
        position: fixed;
        top: var(--to-top);
        left: var(--to-left);
        right: var(--to-right);
        bottom: var(--to-bottom);
        padding: 24px;
    }
}

.file-detail {
    width: 400px;
    max-width: 37.5%;
    animation: file-detail-show 0.25s;
}

@keyframes file-detail-show {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@media (max-width: 750px) {
    .file-view {
        display: block;
    }

    .file-content {
        max-height: 70%;
    }

    .img-container {
        width: 100%;
        animation-name: file-detail-show;
    }

    .file-detail {
        width: initial;
        max-width: initial;
        animation-duration: 0.2s;
    }
}
</style>