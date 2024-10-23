<template>
    <div ref="fileView" class="file-view" :class="{ 'no-zoom-animation': !mediaPreviewImg?.src }" tabindex="0" @keydown.stop="handleKeydown">
        <div ref="fileContent" class="file-content">
            <v-progress-linear v-if="loading" indeterminate color="secondary" height="5"></v-progress-linear>
            <v-btn class="back-btn" variant="text" icon="mdi-arrow-left" @click="router.back()"></v-btn>

            <div ref="mediaContainer" class="media-container">
                <img v-show="showPreview" ref="mediaPreviewImg" draggable="false">

                <template v-if="fileType !== undefined">
                    <video v-show="!showPreview" v-if="fileType?.startsWith('video')" ref="mediaElement" :src="axios.defaults.baseURL + `/files/${fileId}`" autoplay controls loop @loadeddata="loading = false"></video>
                    <img v-show="!showPreview" v-else ref="mediaElement" :src="axios.defaults.baseURL + `/files/${fileId}`" draggable="false" @load="loading = false"></img>
                </template>
            </div>
        </div>

        <div class="file-detail">
            <FileDetail ref="fileDetail" :file-ids="[fileId]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FileDetail from "@/components/FileDetail.vue";

const route = useRoute()
// @ts-ignore
const fileId = route.params.id

const fileView = ref<HTMLDivElement>()
const fileContent = ref<HTMLDivElement>()

const mediaContainer = ref<HTMLDivElement>()
const mediaPreviewImg = ref<HTMLImageElement>()
const mediaElement = ref<HTMLImageElement | HTMLVideoElement>()

const fileDetail = ref<typeof FileDetail>()
const fileType = computed<string | null | undefined>(() => fileDetail.value?.fileDetail?.type)

const loading = ref(true)
const forceShowPreview = ref(false)
const showPreview = computed(() => (forceShowPreview.value || loading.value) && mediaPreviewImg.value?.src)

onBeforeRouteLeave(async () => await fadeOutView(200))
onBeforeRouteUpdate(async () => await fadeOutView(65))

nextTick(() => {
    fileView.value?.focus()

    if (window.lastClickedElement instanceof HTMLImageElement) {
        mediaPreviewImg.value!.src = window.lastClickedElement.src
        forceShowPreview.value = true

        const rect0 = window.lastClickedElement.getBoundingClientRect()
        fileContent.value!.style.setProperty('--from-top', `${rect0.top}px`)
        fileContent.value!.style.setProperty('--from-left', `${rect0.left}px`)
        fileContent.value!.style.setProperty('--from-right', `${window.innerWidth - rect0.right}px`)
        fileContent.value!.style.setProperty('--from-bottom', `${window.innerHeight - rect0.bottom}px`)

        const rect1 = fileContent.value!.getBoundingClientRect()
        fileContent.value!.style.setProperty('--to-top', `${rect1.top}px`)
        fileContent.value!.style.setProperty('--to-left', `${rect1.left}px`)
        fileContent.value!.style.setProperty('--to-right', `${window.innerWidth - rect1.right}px`)
        fileContent.value!.style.setProperty('--to-bottom', `${window.innerHeight - rect1.bottom}px`)

        setTimeout(() => forceShowPreview.value = false, 250);

        window.lastClickedElement = null
    }
})

function fadeOutView(duration: number) {
    return new Promise<void>(resolve => {
        fileView.value?.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration, fill: 'forwards' },
        )
        setTimeout(resolve, duration);
    })
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key == 'Escape') router.back()
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
    animation: bg-show 0.25s;
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
        animation: fadein 0.25s;
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

.media-container {
    box-sizing: border-box;
    padding: 24px;
    animation: img-zoom 0.25s;

    img,
    video {
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
    overflow: auto;
    animation: file-detail-show 0.25s;
}

@keyframes file-detail-show {
    from {
        transform: translateX(50%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.no-zoom-animation {

    .media-container,
    .file-detail {
        animation: fadein 0.25s;
    }
}

@media (max-width: 750px) {
    .file-view {
        display: block;
        overflow-y: auto;
    }

    .file-content {
        max-height: 70%;
    }

    .media-container {
        width: 100%;
        animation-name: file-detail-show;
    }

    .file-detail {
        width: initial;
        max-width: initial;
        animation-duration: 0.25s;
    }
}
</style>