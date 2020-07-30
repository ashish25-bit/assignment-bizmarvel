import React, { Fragment, useState, useEffect } from 'react'
import Header from '../layouts/Header'
import axios from 'axios'
import Moment from 'react-moment'
import uuid from 'react-uuid'
import { Link } from 'react-router-dom'
import { ReactComponent as ClapImg } from '../../images/clap 1.svg';

const Home = () => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({ blogs: [], error: '' })

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get('/api/blog/get/all/blogs')
                setLoading(false)
                setData({ ...data, blogs: res.data })
            }
            catch (err) {
                console.log(err)
                setLoading(false)
                setData({ ...data, error: err.response.data })
            }
        }
        fetchData()
    }, [])

    const { blogs, error } = data

    return (
        <Fragment>
            <Header />
            <div className='main_container home_container'>
                {
                    loading ?
                        <h2>Loading....</h2> :
                        error ?
                            <h2>{error}</h2> :
                            <Fragment>
                                {
                                    blogs.map(({ name, date, read, _id, tags, level, user, claps }) => (
                                        <div style={blogConStyle} key={_id}>
                                            <h1>{name}</h1>
                                            <h3 style={nameStyle}>- By {user.name}</h3>
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
                                            <div>
                                                <ClapImg style={{ height: "26" ,width: "26px" }} /> {' '} 
                                                <span style={{ position: "relative", top: "-4px", fontSize: "small" }}>
                                                    {claps} claps
                                                </span>
                                            </div>
                                            <Link to={`/blog/${name.split(' ').join('-')}/${_id}`}>Read</Link>
                                        </div>
                                    ))
                                }
                            </Fragment>
                }
            </div>
        </Fragment>
    )
}

const blogConStyle = {
    margin: "0px auto",
    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
    borderRadius: "10px",
    padding: "10px 20px",
    marginBottom: "10px"
}

const nameStyle = {
    color: '#555'
}

const labelStyle = {
    color: '#666',
    fontSize: '14px',
    marginRight: '10px'
}

export default Home
