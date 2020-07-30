import React, { useState, Fragment, useEffect } from 'react'
import { ReactComponent as ClapImg } from '../../images/clap 1.svg';
import axios from 'axios';

const Clap = ({ id }) => {

    const [claps, setClaps] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchClaps() {
            try {
                const res = await axios.get(`/api/blog/claps/${id}`)
                console.log(res.data) 
                setClaps(res.data.claps)
                setLoading(false)
            } 
            catch (err) {
                console.log(err)
                setLoading(false)
            }
        }
        fetchClaps()
    }, [])

    const clapped = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        try {
            const res = await axios.put(`/api/blog/clapped/${id}`)    
            setClaps(res.data.claps)
        } 
        catch (err) {
            console.log(err)
        }
    }

    return (
        <Fragment>
            {
                !loading && <div style={divStyle}>
                    <ClapImg className='clapsvg' onClick={clapped} />
                    <p style={{ userSelect: 'none', textAlign: "center", fontSize: "10px" }}>{claps} claps</p>
                </div>
            }
        </Fragment>
    )
}

const divStyle = {
    position: "fixed",
    top: "50%",
    left: "20%",
    transform: "translateY(-50%)",
    width: "65px"
}

export default Clap
