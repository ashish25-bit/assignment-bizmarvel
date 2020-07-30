import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { signup } from '../../actions/auth'
import Alert from '../layouts/Alert'
import { Redirect } from 'react-router-dom'
import Name from '../layouts/Name'
import FormHead from '../layouts/FormHead'
import axios from 'axios'

const Signup = ({ isAuthenticated, loading, signup }) => {
    const [formData, setFormData] = useState({
        username: 'ashish25',
        email: 'ashish23@gmail.com',
        password: '123456',
        name: 'Ashish Yoel'
    })

    const [usernameTaken, setUserNameTaken] = useState(false)

    const { username, email, password, name } = formData

    const changeHandler = e => setFormData(({ ...formData, [e.target.name]: e.target.value })) 

    const onSubmit = e => {
        e.preventDefault()
        signup(formData)
    }

    const checkUsername = async e => {
        try {
            const res = await axios.get(`/api/users/check/username?username=${e.target.value.toLowerCase()}`)
            setUserNameTaken(res.data)
        } 
        catch (err) {
            console.log(err)
        }
    }

    if(isAuthenticated) {
        return <Redirect to='/home' />
    }

    return (
        <Fragment>
            <Name />
            <div className='container_landing'>
                <form className='form-register-signin' onSubmit={e => onSubmit(e)}>
                    <FormHead active='signup' />
                    <div>
                        <input
                            type='text'
                            name='name'
                            autoComplete='off'
                            required
                            placeholder='Enter Full Name'
                            value={name}
                            onChange={e => changeHandler(e)}
                        />
                    </div>
                    <div>
                        <input
                            type='text'
                            name='username'
                            autoComplete='off'
                            required
                            placeholder='Enter Username'
                            value={username}
                            onChange={e => changeHandler(e)}
                            onInput={e => checkUsername(e)}
                        />
                        {
                            usernameTaken && <p className='ajax-msg'>Username Taken</p>
                        }
                    </div>
                    <div>
                        <input
                            type='email'
                            name='email'
                            autoComplete='off'
                            required
                            placeholder='Enter Email'
                            value={email}
                            onChange={e => changeHandler(e)}
                        />
                    </div>
                    <div>
                        <input
                            type='password'
                            name='password'
                            autoComplete='off'
                            required
                            placeholder='password'
                            value={password}
                            onChange={e => changeHandler(e)}
                        />
                    </div>
                    <button disabled={loading}>Signup</button>
                    <div className='gray-option'>Already have an account? <a href='/'>Login</a></div>
                </form>
                <Alert msg='alert-error' />
            </div>
        </Fragment>
    )
}

Signup.propTypes = {
    signup: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { signup })(Signup)
