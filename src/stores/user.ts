import { defineStore } from 'pinia'

const anonymousUser: models.User = {
    name: 'Anonymous',
    avatar: 'default.png'
}

export const useUserStore = defineStore('user', () => {
    const user = ref(anonymousUser)

    const userLoggedIn = computed(() => user.value.id != null && user.value.id != -1)

    async function loadUser() {
        user.value = anonymousUser
        if (localStorage.getItem('token')) {
            try {
                user.value = await requests.getMe()
            } catch (error) { }
        }
        Object.assign(user.value, await requests.getSelf())
    }

    return { user, userLoggedIn, loadUser }
})
