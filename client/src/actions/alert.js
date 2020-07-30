import { SET_ALERT, REMOVE_ALERT, EMPTY_ALERT } from './types'
import uuid from 'react-uuid'

export const setAlert = (msg) => dispatch => {
    const id = uuid()
    // empty the state
    dispatch({
        type: EMPTY_ALERT,
        payload: []
    })
    // setting the alert in the redux container
    dispatch({
        type: SET_ALERT,
        payload: { msg, id }
    })
}

export const removeAlert = id => dispatch => {
    dispatch({
        type: REMOVE_ALERT,
        payload: id
    })
}

export const emptyAlert = () => dispatch => {
    dispatch({
        type: EMPTY_ALERT,
        payload: []
    })
}