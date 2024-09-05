import request from "../utils/request.js";
import {useSettingsStore} from "../stores/settingsData.js";


export function testGithubApi() {
    const mSettingsStore = useSettingsStore();

    return request({
        url:`/repos/${mSettingsStore.githubSettings.name}/${mSettingsStore.githubSettings.repo}/contents/`,
        headers:{
            "Accept":`application/vnd.github+json`,
            "Authorization":`Bearer ${mSettingsStore.githubSettings.token}`,
            "X-GitHub-Api-Version": `2022-11-28`,
            "Cache-Control": "no-cache",
        },
        method:'get'
    })
}

export function upload(name, data) {
    const mSettingsStore = useSettingsStore();

    return request({
        url:`/repos/${mSettingsStore.githubSettings.name}/${mSettingsStore.githubSettings.repo}/contents/`+name,
        headers:{
            "Accept":`application/vnd.github+json`,
            "Authorization":`Bearer ${mSettingsStore.githubSettings.token}`,
            "X-GitHub-Api-Version": `2022-11-28`
        },
        method:'put',
        data: data
    })
}

export function uploadTest() {
    const mSettingsStore = useSettingsStore();

    // data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=
    const requestData = {
        message:'test img upload',
        content: 'R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    }
    return request({
        url:`/repos/${mSettingsStore.githubSettings.name}/${mSettingsStore.githubSettings.repo}/contents/`+"helloblack.jpg",
        headers:{
            "Accept":`application/vnd.github+json`,
            "Authorization":`Bearer ${mSettingsStore.githubSettings.token}`,
            "X-GitHub-Api-Version": `2022-11-28`
        },
        method:'put',
        data: requestData
    })
}
