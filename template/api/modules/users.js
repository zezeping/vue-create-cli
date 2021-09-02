import apiAxios from '@/utils/apiAxios'
export default {
    getUsers (params) { return apiAxios.get('/api/getUsers', { params }) },
}