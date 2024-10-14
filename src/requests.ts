import { AxiosProgressEvent } from "axios"


export function setupRequests() {
    axios.defaults.baseURL =
        location.hostname.includes('localhost') || location.hostname.includes('haojiezhe12345.top')
            ? 'api'
            : 'https://haojiezhe12345.top:82/madohomu/archive/api'

    axios.defaults.headers.token = localStorage.getItem('token')
    document.cookie = `token=${localStorage.getItem('token')}`

    axios.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        utils.showSnackbar(error)
        return Promise.reject(error);
    });
}



export async function getMe() {
    return (await axios.get<models.User>('https://haojiezhe12345.top:82/madohomu/api/user/me')).data
}

export async function getSelf() {
    return (await axios.get<models.User>('users/self')).data
}



export async function getFiles(params?: {
    fromId?: number
    fromTime?: string
    type?: string
    count?: number
}) {
    return (await axios.get<models.File[]>('files', { params })).data
}

export async function getFileDeatil(id: number) {
    return (await axios.get<models.File>(`files/${id}/detail`)).data
}



export async function getTags(params?: {
    type?: string
    searchKey?: string
    reverse?: boolean
    page?: number
    pageSize?: number
}) {
    return (await axios.get<models.Tag[]>('tags', { params })).data
}

export async function uploadFiles(files: File[], onUploadProgress?: (e: AxiosProgressEvent) => void) {
    const form = new FormData()
    files.forEach(file => form.append('files', file))
    return (await axios.postForm<models.FilesUploadResult>('files', form, { onUploadProgress })).data
}

export async function deleteFile(id: number) {
    return (await axios.delete(`files/${id}`)).data
}
