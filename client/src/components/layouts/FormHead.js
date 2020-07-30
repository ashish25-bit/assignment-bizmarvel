import React from 'react'

function FormHead({ active }) {
    return (
        <div className='formhead'>
            <a className={active === 'login' ? 'active' : 'login not-active'} href='/'>Login</a>        
            <a className={active !== 'login' ? 'active' : 'signup not-active'} href='/signup'>Signup</a>        
        </div>
    )
}

export default FormHead
