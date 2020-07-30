import React, { Fragment, useState, useEffect } from 'react'
import Header from '../layouts/Header'
import axios from 'axios'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import uuid from 'react-uuid'

const Profile = ({ match }) => {
    const [userLoading, setUserLoading] = useState(true)
    const [blogLoading, setBlogLoading] = useState(true)
    const [user, setUser] = useState({ data: {}, error: "" })
    const [blogs, setBlogs] = useState({ data: [], error: "" })

    useEffect(() => {
        async function fetchData() {
            // get the user data
            try {
                const res = await axios.get(`/api/users/get/user/${match.params.username}`)
                setUserLoading(false)
                setUser({ ...user, data: res.data })
            }
            catch (err) {
                console.log(err)
                setUserLoading(false)
                if (err.response !== undefined)
                    setUser({ ...user, error: err.response.data })
                else
                    setUser({ ...user, error: "Server Error." })
            }

            // get the blogs
            try {
                const res = await axios.get(`/api/blog/get/blogs/user/${match.params.username}`)
                setBlogLoading(false)
                setBlogs({ ...blogs, data: res.data })
            }
            catch (err) {
                console.log(err)
                setBlogLoading(false)
                if (err.response !== undefined)
                    setBlogs({ ...blogs, error: err.response.data })
                else
                    setBlogs({ ...blogs, error: "Server Error" })
            }
        }
        fetchData()
    }, [])

    return (
        <Fragment>
            <Header />
            <div className='main_container profile_con'>
                {
                    userLoading ?
                        <p>Loading...</p> :
                        user.error ?
                            <h3>{user.error}</h3> : <Fragment>
                                <h2 style={{ fontSize: "48px" }}>{user.data.name}</h2>
                                <h3 style={{ color: '#878787', fontSize: "24px", position: "relative", bottom: "10px" }}>@{user.data.username}</h3>
                                <p style={{ fontSize: "15px", marginTop: '-10px' }}>Joined On - {' '}
                                    <Moment format='Do MMMM, YYYY'>{user.data.date}</Moment>
                                </p>
                            </Fragment>
                }

                {
                    blogLoading ?
                        <p>Loading...</p> :
                        blogs.error ?
                            <h3>{blogs.error}</h3> :
                            <div className='pro_blog_con'>
                                <h4 style={head}>{blogs.data.length} blogs posted.</h4>
                                {
                                    blogs.data.map(({ name, date, read, _id, tags, level }) => (
                                        <div style={blogStyle} key={_id}>
                                            <h1>{name}</h1>
                                            <p style={labelStyle}>Posted On - {' '}
                                                <Moment format='hh:mm A Do MMM YYYY'>{date}</Moment>
                                            </p>
                                            <span style={labelStyle}>{read} min read</span> {' '}
                                            <span style={labelStyle}>{level}</span>
                                            <div className='tags_con'>
                                                {
                                                    tags.length && tags.map(
                                                        tag => <div key={uuid()}>{tag}</div>
                                                    )
                                                }
                                            </div>
                                            <Link to={`/blog/${name.split(' ').join('-')}/${_id}`}>Read</Link>
                                        </div>
                                    ))
                                }
                            </div>
                }
            </div>
        </Fragment>
    )
}

const labelStyle = {
    color: '#666',
    fontSize: '14px',
    marginRight: '10px'
}

const blogStyle = {
    margin: "10px 0",
    padding: "10px 20px",
    borderRadius: "10px",
    boxShadow: "0 0 4px rgba(0,0,0,0.4)"
}

const head = {
    fontSize: '1.6rem',
    fontWeight: '500'
}

export default Profile
