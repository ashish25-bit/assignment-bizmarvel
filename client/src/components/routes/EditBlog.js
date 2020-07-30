import React, { Fragment, useState, useEffect } from 'react'
import Header from '../layouts/Header'
import Editor from '../layouts/Editor'
import Markdown from '../layouts/Markdown'
import editorContext from '../../utils/editorContext'
import axios from 'axios'
import PropTypes from 'prop-types'
import { emptyAlert, setAlert } from '../../actions/alert'
import { connect } from 'react-redux'
import Alert from '../layouts/Alert'
import uuid from 'react-uuid'
import { withRouter } from 'react-router-dom'
// import AddImage from '../layouts/AddImage'

const EditBlog = ({ match, setAlert, emptyAlert, history }) => {
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [tag, setTag] = useState('')
    const [data, setData] = useState({ info: {}, error: "" })
    const [markdownText, setMarkdownText] = useState("")
    const contextValue = {
        markdownText,
        setMarkdownText
    }
    const { info, error } = data
    const [blogData, setBlogData] = useState({
        id: match.params.id,
        name: "",
        read: 1,
        level: "",
        tags: []
    }) 

    const changeHandler = e => setBlogData({ ...blogData, [e.target.name]: e.target.value })

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`/api/blog/get/${match.params.id}`)
                setLoading(false)
                setData({ ...data, info: res.data.info })
                setBlogData({ ...blogData, name: res.data.info.name })
            }
            catch (err) {
                setLoading(false)
                if (err.response !== undefined)
                    setData({ ...data, error: err.response.data })
                else
                    setData({ ...data, error: "Unexpected Error." })
            }
        }
        fetchData()
    }, [match])

    const saveDoc = async () => {
        setAlert('Saving..')
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await axios.put('/api/blog/save/blog', { id: match.params.id, content: markdownText }, config)
            setAlert(res.data) 
        } 
        catch (err) {
            console.log(err)
            setAlert("Sever Error. Cannot Save.") 
        }
        setTimeout(() => emptyAlert(), 5000)
    }

    const formSubmit = async e => {
        e.preventDefault()
        if (!markdownText)
            return alert('The Markdown Cannot be left empty')

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let { id, read, tags, name, level } = blogData
        setPosting(true)
        read = parseInt(read)
        try {
            const res = await axios.post('/api/blog/post', { id, name, read, tags, markdownText, level }, config)
            console.log(res)
            return history.push('/home')
        } 
        catch (err) {
            setPosting(false)
        }
        axios.post('/post/blog', blogData, config)
    }

    return (
        <editorContext.Provider value={contextValue}>
            <Fragment>
                <Header />
                <div className='main_container upload_container'>
                    {
                        loading ?
                            <h1>Loading...</h1> :
                            error !== "" ?
                                <h1>Error</h1> :
                                <Fragment>
                                    <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{info.name}</span> {' '}
                                    <button className='saveDoc' onClick={saveDoc}>Save</button>
                                    {/* <AddImage /> */}
                                    <div className='editor_container'>
                                        { info.context !== undefined && <Editor content={info.context} /> }
                                        <Markdown />
                                    </div>

                                    <form className='post-blog' onSubmit={e => formSubmit(e)}>
                                        <h3>Enter details and post the blog</h3>
                                        <div className='input_con'>
                                            <div className='add_read'>
                                                <input 
                                                    type='number'
                                                    name="read"
                                                    onChange={e => changeHandler(e)}
                                                    autoComplete='off'
                                                    required
                                                    min={1}
                                                /> 
                                                <label>Minutes Read(required)</label>
                                            </div>
                                            <div className='add_level'>
                                                <label>Select Level:</label>
                                                <select name="level" onChange={e => changeHandler(e)} required>
                                                    <option value=''>Select Level Here</option>
                                                    <option value='Beginner'>Beginner</option>
                                                    <option value='Intermediate'>Intermediate</option>
                                                    <option value='Advanced'>Advanced</option>
                                                    <option value='Expert'>Expert</option>
                                                </select>
                                            </div>
                                            <div className='add_tag'>
                                                <input 
                                                    type='text'
                                                    name='tag'
                                                    placeholder='Enter Tag.'
                                                    value={tag}
                                                    onChange={e => setTag(e.target.value)}
                                                />
                                                <button 
                                                    type='button'
                                                    onClick={() => {
                                                        if (!tag)
                                                            alert('Enter Tag Name.')
                                                        else {
                                                            blogData.tags.push({ id: uuid(), title: tag })
                                                            setTag('')
                                                        }
                                                    }}
                                                >Add Tag</button>
                                            </div>
                                        </div>
                                        <div className='tag_con'>
                                            {
                                                blogData.tags.map(({ id, title }) => <div 
                                                        title='Click me to remove me.' 
                                                        key={id}
                                                        tag-id={id}
                                                        onClick={e => {
                                                            const tags1 = blogData.tags
                                                            const index = tags1.findIndex(tag => tag.id === e.target.getAttribute('tag-id'))
                                                            tags1.splice(index, 1)
                                                            setBlogData({...blogData, tags: tags1})
                                                        }}
                                                    >{title}</div>
                                                )
                                            }
                                        </div>
                                        <button disabled={posting} className='post-blog-btn' type='submit'>Post Blog</button>
                                    </form>    
                                </Fragment>
                    }
                </div>
                <Alert msg='alert-save' />
            </Fragment>
        </editorContext.Provider>
    )
}

EditBlog.propTypes = {
    setAlert: PropTypes.func.isRequired,
    emptyAlert: PropTypes.func.isRequired
}

export default withRouter(connect(null, {setAlert, emptyAlert})(EditBlog))
