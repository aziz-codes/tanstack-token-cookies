"use client"
import React,{useEffect} from 'react'

const Test = () => {
    useEffect(()=>{
        (async() => {
           try{
            const res = await fetch('http://localhost:5000/test',{
                method: "POST",
                credentials: 'include',
            })
           if(res.ok){
            const data = await res.json();
            console.log(data)
           }
           }
           catch(err){
            console.log(err);
           }
         
          })();
    },[])
  return (
    <div>Test route handlers</div>
  )
}

export default Test