import apiAxios from '@/utils/apiAxios'
export const getUsers = (params) => apiAxios.get('/api/getUsers', { params })
