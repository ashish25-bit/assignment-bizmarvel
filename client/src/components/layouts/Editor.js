import React, { useState, useContext, useEffect } from 'react'
import editorContext from '../../utils/editorContext'

const Editor = ({ content }) => {
    const { setMarkdownText } = useContext(editorContext)
    const [textValue, setTextValue] = useState(content)

    useEffect(() => {
        setMarkdownText(content)
    }, [setMarkdownText])

    const onInputChange = e => {
        const newValue = e.currentTarget.value
        setTextValue(e.currentTarget.value)
        setMarkdownText(newValue)
    }

    return (
        <div>
            <h2>Editor</h2>
            <hr />
            <textarea 
                className='blog_textarea custom_scrollbar'
                onChange={e => onInputChange(e)}
                value={textValue}
            ></textarea>
        </div>
    )
}

export default Editor
