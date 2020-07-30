import React, { useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import editorContext from '../../utils/editorContext'

const Markdown = () => {

    const { markdownText } = useContext(editorContext)

    return (
        <div>
            <h2>Result</h2>
            <hr />
            <div className='markdown_result custom_scrollbar'>
                <ReactMarkdown source={markdownText} />
            </div>
        </div>
    )
}

export default Markdown
