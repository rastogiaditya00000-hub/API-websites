import React, { useState } from 'react'

const About = () => {

  const [n,setN] = useState(0)

    const inc=()=>{
        setN(n+1)
    }
    const dec=()=>{
      if(n>0){
        setN(n-1)
      }
      



    }

  
  return (
    <>
      <h1>this is contact</h1>


<div style={{height:'100px',width:'200px',backgroundColor:'white'}}>

        <button onClick={dec}>-</button> {n} <button onClick={inc}>+</button>
</div>
    </>
  )
}

export default About
