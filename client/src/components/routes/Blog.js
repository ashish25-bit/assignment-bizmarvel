import React, { Fragment, useState, useEffect } from 'react'
import Header from '../layouts/Header'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import Clap from '../layouts/Clap'

const Blog = ({ match }) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/blog/get/one/${match.params.id}`)
                setLoading(false)
                setData(res.data)
            }
            catch (err) {
                console.log(err)
                setLoading(false)
                setData(null)
            }
        }
        fetchData()
    }, [])

    return (
        <Fragment>
            <Header />
            <div className='main_container main_blog_container'>
                {
                    loading ?
                        <h1>Loading</h1> :
                        !data ? <h1>There was an Error</h1> :
                            <div className='blog-content'>
                                <Clap id={match.params.id} />
                                <h1>{data.name}</h1>
                                {
                                    data.user !== undefined && <p>Author - {data.user.name}{' '}
                                        <Link to={`/profile/${data.user.username}`}>
                                            <i className="fa fa-share" aria-hidden="true"></i>
                                        </Link>
                                    </p>
                                }
                                <hr />
                                <ReactMarkdown source={data.context} />
                            </div>
                }
            </div>
        </Fragment>
    )
}
export default Blog
