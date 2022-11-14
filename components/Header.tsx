import React from 'react'
import NavButton from './NavButton';
import {Bars3BottomRightIcon} from "@heroicons/react/24/solid"
import { useAddress, useDisconnect } from '@thirdweb-dev/react';

function Header() {
  const address = useAddress();
  const disconnect = useDisconnect();

  return (
    <div className=' grid grid-cols-2 md:grid-cols-5 justify-between items-center '>
        <div className='flex  items-center space-x-2'>
          <img className='rounded-full bg-gradient-to-br from-cyan-800 to-rose-500 p-1 m-2 h-20 w-20' src= "https://media.istockphoto.com/vectors/realistic-3d-spinning-fortune-wheel-lucky-roulette-vector-vector-id680501008?k=20&m=680501008&s=612x612&w=0&h=WNbUp3_wKpPP6jHw3cxvWOM_CxF1uO0CR6c9Ee7f8n8=" alt="icon" />
        <div>
          <h1 className=' text-lg text-white font-bold'>SweepStake</h1>
          <p className=' text-xs text-emerald-500 truncate'>User: {address?.substring(0,5)}...{address?.substring(address.length, address.length-4)}
          </p>
          </div>
        </div>
        <div className=' hidden md:flex md:col-span-3 items-center justify-center rounded-md '>
          <div className=' p-4 space-x-4'>
            <NavButton isActive title='Buy Tickets'/>
            <NavButton onClick={disconnect} title='Logout'/>
          </div>
        </div>
        <div className=' flex flex-col ml-auto text-right'>
          {/* <Bars3BottomRightIcon className=' h-8 mx-auto text-white cursor-pointer'/> */}
          <span className=' md:hidden'>
            <NavButton onClick={disconnect} title='Logout' />
          </span>
        </div>
    </div>
  );
}

export default Header