import { useMetamask } from '@thirdweb-dev/react'
import React from 'react'

function Login() {
    const connectwithMetamask = useMetamask();

  return (
    <div className=" to bg-gray-600 bg-gradient-to-br from-black min-h-screen flex flex-col  items-center justify-center text-center">
        <div className=' flex flex-col items-center   mb-10'>
        <img className='rounded-full bg-gradient-to-br from-cyan-800 to-rose-500 p-1 m-2 h-56 w-56' src= "https://media.istockphoto.com/vectors/realistic-3d-spinning-fortune-wheel-lucky-roulette-vector-vector-id680501008?k=20&m=680501008&s=612x612&w=0&h=WNbUp3_wKpPP6jHw3cxvWOM_CxF1uO0CR6c9Ee7f8n8=" alt="icon" />
        <h1 className=' text-6xl text-white font-bold'>SWEEPSTAKE</h1>
        <h2 className=' text-white text-1xl'>A Fun Decentralised Lucky Draw Game</h2>
        <button 
        onClick={connectwithMetamask}
        className=' bg-white px-8 py-5 mt-10 rounded-lg shadow-lg font-bold'>Login with Metamask</button>
        </div>
    </div>
  )
}

export default Login