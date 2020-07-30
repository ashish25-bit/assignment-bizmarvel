import axios from 'axios'
import { setAlert } from './alert'

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const createBlog = name => async dispatch => {
    try {
        const res = await axios.post('/api/blog/create', { name }, config)
        return res.data
    }
    catch (err) {
        dispatch(setAlert('Server Error'))
        return null
    }
} 
