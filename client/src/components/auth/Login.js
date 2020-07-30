import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'
import Alert from '../layouts/Alert'
import { Redirect } from 'react-router-dom'
import Name from '../layouts/Name'
import FormHead from '../layouts/FormHead'

const Login = ({ isAuthenticated, login, loading }) => {
    const [formData, setFormData] = useState({
        username: 'ashish23@gmail.com',
        password: '123456'
    })
    const { username, password } = formData

    const changeHandler = e => setFormData({ ...formData, [e.target.name]: e.target.value }) 

    const onSubmit = e => {
        e.preventDefault()
        login(formData)
    }

    if(isAuthenticated) {
        return <Redirect to='/home' />
    }

    return (
        <Fragment>
            <Name />
            <div className='container_landing'>
                <form className='form-register-signin' onSubmit={e => onSubmit(e)}>
                    <FormHead active='login' />
                    <input 
                        type='text'
                        name='username'
                        autoComplete='off'
                        required
                        placeholder='Enter Username or Email'
                        value={username}
                        onChange={e => changeHandler(e)}
                    />
                    <input 
                        type='password'
                        name='password'
                        autoComplete='off'
                        required
                        placeholder='Enter Password'
                        value={password}
                        onChange={e => changeHandler(e)}
                    />
                    <button disabled={loading}>Login</button>
                    <div className='gray-option'>Create an account {'>>'} <a href='/signup'>SIGNUP</a> here.</div>
                </form>
                <Alert msg='alert-error' />
            </div>
        </Fragment>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { login })(Login)
