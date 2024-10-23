export { }

declare global {
    interface Window {
        lastClickedElement: HTMLElement | HTMLImageElement | null
    }

    namespace models {
        export interface User {
            id?: number
            name: string
            avatar: string
            hasEmail?: boolean
            hasPassword?: boolean
            create_time?: number
            email?: string

            permission?: number
            accessLevel?: number
            owner?: number
            settings?: [{
                name: string
                value: string
            }]
        }

        export interface File {            permission?: number
            owner?: number
            id: number
            type?: string
            r18?: boolean
            title?: string
            description?: string
            source?: string
            width?: number
            height?: number

            file?: string
            size?: number
            dateCreated?: string
            dateModified?: string
            tags: Tag[]
        }

        export interface Tag {
            permission?: number
            owner?: number
            id: number
            type?: string
            imageFile?: number
            description?: string
            names: [{
                name: string
                lang: string
            }]
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
    }
}
