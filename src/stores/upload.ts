import { defineStore } from 'pinia'


export interface uploadTask {
    files: TaskFile[]
    props?: models.FilesUpdateDTO
}

export interface TaskFile {
    file: File
    fileDataURL?: string
    status: TaskFileStatus
    progress?: number
    message?: string
    id?: number
}

export enum TaskFileStatus {
    Pending = 'Pending',
    Uploading = 'Uploading',
    OK = 'Upload succeeded',
    Failed = 'Upload failed',
}

export const useUploadStore = defineStore('upload', () => {
    const tasks = ref<uploadTask[]>([])
    const uploadShowing = ref(false)

    async function createUploadTask(files: File[], props?: models.FilesUpdateDTO) {
        const task: uploadTask = { files: [], props }
        files.forEach(file => {
            task.files.push({ file, status: TaskFileStatus.Pending })
        })
        const i = tasks.value.push(task) - 1

        nextTick(() => uploadShowing.value = true)

        await Promise.all(tasks.value[i].files.map(async file => {
            file.status = TaskFileStatus.Uploading

            if (file.file.type.startsWith('image')) {
                const reader = new FileReader()
                reader.readAsDataURL(file.file)
                reader.onload = () => typeof reader.result == 'string' && (file.fileDataURL = reader.result)
            }

            await requests.uploadFiles([file.file], e => {
                if (e.total) file.progress = Math.round(e.loaded / e.total * 100)
            })
                .then(r => {
                    if (r.code == 1) {
                        file.status = TaskFileStatus.OK
                        file.message = r.message
                        file.id = r.data[0]
                    } else {
                        file.status = TaskFileStatus.Failed
                        file.message = r.message
                    }
                })
                .catch(e => {
                    file.status = TaskFileStatus.Failed
                    file.message = e
                })
        }))

        tasks.value[i].files.forEach(file => {
        })
    }

    return { tasks, uploadShowing, createUploadTask }
})
