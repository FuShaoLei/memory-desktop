import {defineStore} from 'pinia'


export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            githubSettings: {
                token: "",
                name: "",
                repo: "",
                branch: ""
            }
        }
    },
    actions: {
        setGithubSettings(newGithubSettings) {
            this.githubSettings = newGithubSettings
        }
    },
    persist: true
})