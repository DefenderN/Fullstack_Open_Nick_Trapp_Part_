import axios from 'axios'
const baseUrl = '/api/login'

const login = async (username, password) => {
    const loginResponse = await axios.post(baseUrl, {username, password})
    return loginResponse.data
}   

export default { login }



