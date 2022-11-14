import React from 'react'
import { PropagateLoader } from 'react-spinners'

function Loading() {
  return (
    <div className=" to bg-gray-600 bg-gradient-to-br from-black min-h-screen flex flex-col items-center justify-center">
    <div className='flex items-center space-x-2 mb-18'>
      <img className='rounded-full bg-gradient-to-br from-cyan-800 to-rose-500 p-1 m-2 h-56 w-56' src= "https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/04/21/17-Lottery1.jpg?quality=75&width=982&height=726&auto=webp" alt="icon" />
      <h1 className=' text-lg text-white font-bold'>Hang on SweepStakers...</h1>
    </div>
    <PropagateLoader color='white' size={30}/>
  </div>
  )
}

export default Loading