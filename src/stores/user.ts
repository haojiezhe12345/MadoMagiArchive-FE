import { defineStore } from 'pinia'

const anonymousUser: models.User = {
    name: 'Anonymous',
    avatar: 'default.png'
}

export const useUserStore = defineStore('user', () => {
    const user = ref(anonymousUser)

    const userLoggedIn = computed(() => user.value.id != null && user.value.id != -1)

    const accessLevel = computed(() => utils.parseHexPermission(user.value.accessLevel))

    const accessLevelString = computed(() => {
        if (accessLevel.value.read >= 255) {
            return accessLevel.value.read > 255 && accessLevel.value.read > 255
                ? 'Master+'
                : 'Master'
        }
        if (accessLevel.value.read >= 100) {
            return accessLevel.value.write > 100 && accessLevel.value.delete > 100
                ? 'Admin+'
                : 'Admin'
        }
        if (accessLevel.value.read >= 20) {
            return accessLevel.value.write > 20 && accessLevel.value.delete > 20
                ? 'Advanced+'
                : 'Advanced'
        }
        if (accessLevel.value.read >= 10) {
            return accessLevel.value.write > 10 && accessLevel.value.delete > 10
                ? 'Standard+'
                : 'Standard'
        }
        if (accessLevel.value.read >= 1) {
            return accessLevel.value.write > 1 && accessLevel.value.delete > 1
                ? 'Limited+'
                : 'Limited'
        }
        return 'Unknown'
    })

    async function loadUser() {
        user.value = anonymousUser
        if (localStorage.getItem('token')) {
            try {
                user.value = await requests.getMe()
            } catch (error) { }
        }
        Object.assign(user.value, await requests.getSelf())
    }

    return { user, userLoggedIn, accessLevel, accessLevelString, loadUser }
})
