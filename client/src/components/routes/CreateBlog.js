import React, { Fragment, useState, useEffect } from 'react'
import Header from '../layouts/Header'
import PropTypes from 'prop-types'
import { createBlog } from '../../actions/blog'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Alert from '../layouts/Alert'
import axios from 'axios'
import uuid from 'react-uuid'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'

const CreateBlog = ({ createBlog, history }) => {

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [fetching, setFetching] = useState(true) 
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get('/api/blog/saved/all')
                setFetching(false)
                setBlogs(res.data)
            } 
            catch (err) {
                console.log(err)
            }
        } 
        fetchData()
    }, [])

    const onSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await createBlog(name)
            console.log(res)
            if (res !== null )
                return history.push(`/edit/blog/${res}`)
        } 
        catch (err) {
            console.log(err)
        }
    }

    return (
        <Fragment>
            <Header />
            <div className='main_container'>
                <form className='create_blog_form' onSubmit={e => onSubmit(e)}>
                    <input
                        type='text'
                        className='blog-name'
                        required
                        autoComplete='off'
                        name='name'
                        value={name}
                        placeholder='Enter Name Of The Blog.'
                        onChange={e => setName(e.target.value)}
                    />
                    <button 
                        className={loading ? 'engaged' : 'not_engaged'}
                        disabled={loading}>
                    Create Blog</button>
                </form>
                <Alert msg='alert-blog-create alert-error' />

                <hr style={{margin: "10px 0"}} />

                {
                    fetching? <h2>Loading...</h2> : <div className='blog_container'>
                        {
                            !blogs.length ? <h2>No Blogs Created.</h2> : <Fragment>
                                <h1>Saved Blogs.</h1> {
                                blogs.map(blog => (
                                    <div className='blog' key={uuid()}>
                                        <p className='name'>{blog.name}</p>
                                        <p style={{ color: '#666', fontSize:'14px' }}>Created On - {' '}
                                            <Moment format='hh:mm A Do MMM YYYY'>{blog.date}</Moment>
                                        </p>
                                        <Link to={`/edit/blog/${blog._id}`}>Edit</Link>
                                    </div>
                                ))}
                            </Fragment>
                        }
                    </div>
                }

            </div>
        </Fragment>
    )
}

CreateBlog.propTypes = {
    createBlog: PropTypes.func.isRequired
}

export default withRouter(connect(null, { createBlog })(CreateBlog))