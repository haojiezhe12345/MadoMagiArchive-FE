import { defineStore } from 'pinia'
import { UserMe, getMe } from '@/requests'

const anonymousUser: UserMe = {
    name: 'Anonymous',
    avatar: 'default.png'
}

export const useUserStore = defineStore('user', () => {
    const user = ref(anonymousUser)

    async function loadUser() {
        if (localStorage.getItem('token')) {
            Object.assign(user.value, await getMe())
        } else {
            Object.assign(user.value, anonymousUser)
        }
    }

    return { user, loadUser }
})
