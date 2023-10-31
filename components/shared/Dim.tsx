'use client'
import { useState, useEffect } from 'react'
import React from 'react'

const Dim = () => {
    const [shouldShow, setshouldShow] = useState(false)
    useEffect(()=>{
        setTimeout(() => {
            setshouldShow(true);
        }, 50);
    },[])
    
    return (
        <div 
        style={{
            opacity: shouldShow?('1'):('0')
        }}
        className=" transition-all duration-500 flex justify-center items-center fixed top-0 left-0 z-[100] bg-black bg-opacity-30 w-full h-full">
            <svg
                className="animate-spin h-16 w-16 border-t-2 border-blue-500 rounded-full"
                viewBox="0 0 24 24"
            >
                <linearGradient id="gradient" x1="0" x2="1" y1="1" y2="0">
                    <stop offset="0%" stop-color="#48BB78" />
                    <stop offset="50%" stop-color="#4299E1" />
                    <stop offset="100%" stop-color="#F6AD55" />
                </linearGradient>
                <circle cx="15" cy="14" r="6" fill="none" stroke="url(#gradient)" strokeWidth="2" />
            </svg>
        </div>
    )
}
export default Dim