import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

const Header = ({ auth, logout }) => {
    return (
        <div className='header'>
            <p>
                <Link style={logoStyle} to='/home'>BIZ<span style={logoInnerColor}>MARVEL.</span></Link>
            </p>
            <div>
                <Link className='navLink' to='/home'>Home</Link>
                <Link className='navLink' to='/search'>Search</Link>
                { auth.user && <Link className='navLink' to={`/profile/${auth.user.username}`}>Profile</Link> }
                <Link className='navLink' to='/create/blog'>Create Blog</Link>
            </div>
            <div>
                <p>Welcome, {' '}
                    {
                        auth.user && <Fragment>{auth.user.name.split(' ')[0]}</Fragment>
                    }
                </p>
                <a className='logout' href='/' onClick={logout}>Logout</a>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    auth: state.auth
})

Header.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
}

const logoStyle = {
    color: "#57C867",
    fontWeight: "700" 
}
const logoInnerColor = {
    color: "#3D5F42"
}

export default connect(mapStateToProps, { logout })(Header)
