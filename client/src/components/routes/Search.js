import React, { Fragment, useState, useEffect } from 'react'
import Header from '../layouts/Header'
import axios from 'axios'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import uuid from 'react-uuid'

const Search = () => {
    const [randomLoading, setRanLoading] = useState(true)
    const [randomBlogs, setRandomBlogs] = useState({ data: [], error: '' })
    const [username, setUsername] = useState('')
    const [searchLoading, setSearchLoading] = useState(false)
    const [searched, setSearched] = useState({ data: [], error: "" })

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get('/api/blog/random')
                setRanLoading(false)
                setRandomBlogs({ ...randomBlogs, data: res.data })
            }
            catch (err) {
                setRanLoading(false)
                if (err.response !== undefined)
                    setRandomBlogs({ ...randomBlogs, error: err.response.data })
                else
                    setRandomBlogs({ ...randomBlogs, error: "Some Unknown Error Occured." })
            }
        }
        fetchData()
    }, [])

    const onSubmitHandler = async e => {
        setSearchLoading(true)
        e.preventDefault()
        if (!username)
            return alert('Please Enter Text.')
        
        try {
            const res = await axios.get(`/api/users/search/user?key=${username}`)
            console.log(res)
            setSearched({ ...searched, data: res.data })
            setSearchLoading(false)
        } 
        catch (err) {
            setSearchLoading(false)
            console.log(err)
            setSearched({ ...searched, error: "An Error Occured." })
        }
    }

    return (
        <Fragment>
            <Header />
            <div className='main_container' style={searchConStyle}>
                <form style={{ margin: "10px 0" }} onSubmit={e => onSubmitHandler(e)}>
                    <input
                        type='text'
                        autoComplete='off'
                        name='name'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={inputStyle}
                    />
                    <button style={btnStyle} type='submit'>Search User</button>
                </form>
                <div>
                    {
                        searchLoading ? 
                            <h2>Loading...</h2> : 
                            searched.error && searched.data.length ? 
                                <h2>No Results Found.</h2> : 
                                <Fragment>
                                    {
                                        searched.data.map(user => (
                                            <div style={searchItem} key={user._id}>
                                                <h2>{user.name}</h2>
                                                <h3 style={{ color: "#777" }}>@{user.username}</h3>
                                                <Link to={`/profile/${user.username}`}>Visit Profile</Link>
                                            </div>
                                        ))
                                    }
                                </Fragment>
                    }
                </div>
                {
                    randomLoading ?
                        <h1>Loading...</h1> :
                        randomBlogs.error ?
                            <h1>{randomBlogs.error}</h1> :
                            <div className='random_blogs'>
                                <h2>Some Random Blogs</h2>
                                {
                                    randomBlogs.data.map(({ name, date, tags, user, _id, read, level }) => (
                                        <div style={blogStyle} key={_id}>
                                            <h1>{name}</h1>
                                            <p>Author - {user.name}{' '}
                                                <Link to={`/profile/${user.username}`}>
                                                    <i className="fa fa-share" aria-hidden="true"></i>
                                                </Link>
                                            </p>
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

const blogStyle = {
    margin: "10px 0",
    padding: "10px 20px",
    borderRadius: "10px",
    boxShadow: "0 0 4px rgba(0,0,0,0.4)"
}

const labelStyle = {
    color: '#666',
    fontSize: '14px',
    marginRight: '10px'
}

const searchConStyle = {
    width: "80%",
    margin: "0 auto"
}

const btnStyle = {
    padding: "5px 10px",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    textTransform: "uppercase",
    width: "calc( 100% - 80% - 40px )",
}

const inputStyle = {
    width: "80%",
    padding: "5px 10px",
    border: "1px solid #ccc",
    marginRight: "10px",
}
const searchItem = {
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 0 4px rgba(0, 0, 0, 0.4)",
    margin: "10px 0",
}

export default Search