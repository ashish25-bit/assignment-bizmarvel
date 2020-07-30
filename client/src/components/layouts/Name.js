import React from 'react'

const Name = () => {
    return (
        <h1 style={head}>Biz<span style={innerColor}>marvel.</span></h1>
    )
}

const head = {
    textTransform: "uppercase",
    fontSize: "5rem",
    color: "#57C867",
    margin: "20px 30px"
}
const innerColor = {
    color: "#3D5F42"
}

export default Name
