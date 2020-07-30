import axios from 'axios'
import { setAlert } from './alert'
import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types'
import setAuthToken from '../utils/setAuthToken'

const config = {
    headers: {
        "Content-type": "application/json"
    }
}

// checks whether the logged in user is valid and in session or not.
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
        try {
            const res = await axios.get('/api/users/auth')
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        }
        catch (err) {
            dispatch({
                type: AUTH_ERROR
            })
        }
    }
}

// signup function
export const signup = ({ username, email, password, name }) => async dispatch => {
    const body = JSON.stringify({ username, email, password, name })
    
    // dispatch the user loading here
    dispatch({ type: USER_LOADING, payload: true })
    try {
        const res = await axios.post('/api/users/register', body, config)
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }) 
        dispatch(loadUser())
    } 
    catch (err) {
        dispatch(setAlert(err.response.data))
        dispatch({
            type: REGISTER_FAIL
        })
    }
} 

// login function
export const login = ({ username, password }) => async dispatch => {
    const body = JSON.stringify({ username, password })

    // dispatch the user loading here
    dispatch({ type: USER_LOADING, payload: true })
    try {
        const res = await axios.post('/api/users/login', body, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }) 
        dispatch(loadUser())
    } 
    catch (err) {
        dispatch({ type: USER_LOADING, payload: false })
        dispatch(setAlert(err.response.data))
        dispatch({
            type: LOGIN_FAIL
        })
    }
}

// logout
export const logout = () => dispatch => dispatch({ type: LOGOUT }) 
