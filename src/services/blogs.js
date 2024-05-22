import axios from 'axios'
import Blog from '../components/Blog'
const baseUrl = '/api/blogs'

const getAll = () => {
    // GET all blogs from server
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newBlog, userToken) => {
    // setup authorization header with userToken
    const config = {
        headers: { Authorization: `Bearer ${userToken}` }
    }
    // POST newBlog to server
    const request = axios.post(baseUrl, newBlog, config)

    return request.then(response => response.data)
}


export default { getAll, create }