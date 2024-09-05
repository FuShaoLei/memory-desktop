import axios from 'axios'
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production'?'https://api.github.com/':'/api',
    timeout: 10000 // 超时时间
})

export default service