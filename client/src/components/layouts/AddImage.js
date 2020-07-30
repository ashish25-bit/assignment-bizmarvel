import React, { useState } from 'react'
import axios from 'axios'

const AddImage = () => {    
    const [image, setImages] = useState('')
    const selectImages = e => setImages(e.target.files[0])

    const onSubmitHandler = async e => {
        e.preventDefault()
        if (!image) 
            return alert('Please Select images..')
        
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const formData = new FormData()
        formData.append('file', image)
        console.log(image)

        try {
            const res = await axios.post('/api/blog/image/upload', formData, config)
            console.log(res)
        } 
        catch (err) {
            console.log(err)
        }

    }

    return (
        <form style={{ margin: "15px 0" }} onSubmit={e => onSubmitHandler(e)}>
            <input 
                type='file' 
                id='add-images'
                name='image'
                onChange={e => selectImages(e)}
            />
            <label htmlFor='add-images' className='label-for-add-images'>Upload Images</label>
            {/* <span>{` ${images.length}`} images selected</span> <br/> */}
            <button className='upload-images'>Add Images</button>
        </form>
    )
}

export default AddImage
