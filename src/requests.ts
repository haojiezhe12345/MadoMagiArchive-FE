import { AxiosProgressEvent } from "axios"


export interface UserMe {
    id?: number
    name: string
    avatar: string
    hasEmail?: boolean
    hasPassword?: boolean
    create_time?: number
    email?: string
}

export async function getMe() {
    return (await axios.get<UserMe>('https://haojiezhe12345.top:82/madohomu/api/user/me')).data
}



export interface FileItem {
    permission: number
    owner: number
    id: number
    type: string
    r18: boolean
    title: string
    description: string
    source: string
    file: string
    size: number
    dateCreated: string
    dateModified: string
    tags: [{
        permission: number
        owner: number
        id: number
        type: string
        imageFile: number
        description: string
        names: [{
            name: string
            lang: string
        }]
    }]
}

export interface GetFilesQuery {
    fromId?: number
    fromTime?: string
    type?: string
    count?: number
}

export async function getFiles(params?: GetFilesQuery) {
    return (await axios.get<FileItem[]>('files', { params })).data
}

export async function getFileDeatil(id: number) {
    return (await axios.get<FileItem>(`files/${id}/detail`)).data
}



export interface Tag {
    permission: number
    owner: number
    id: number
    type: string
    imageFile: number
    description: string
    names: [{
        name: string
        lang: string
    }]
}

export interface GetTagsQuery {
    type?: string
    searchKey?: string
    reverse?: boolean
    page?: number
    pageSize?: number
}

export async function getTags(params?: GetTagsQuery) {
    return (await axios.get<Tag[]>('tags', { params })).data
}



export interface FilesUpdateDTO {
    ids: number[]
    type?: string
    r18?: boolean
    title?: string
    description?: string
    source?: string
    tagsAdded?: number[]
    tagsDeleted?: number[]
    permission?: number
}

export interface FilesUploadResult {
    code: number
    message: string
    data: number[]
}

export async function uploadFiles(files: File[], onUploadProgress?: (e: AxiosProgressEvent) => void) {
    const form = new FormData()
    files.forEach(file => form.append('files', file))
    return (await axios.postForm<FilesUploadResult>('files', form, { onUploadProgress })).data
}


export async function deleteFile(id: number) {
    return (await axios.delete(`files/${id}`)).data
}
