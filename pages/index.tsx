import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header';
import {  useAddress,useContract,useContractRead,useContractWrite, useDisconnect} from '@thirdweb-dev/react';
import Login from '../components/Login';
import  PropagateLoader  from 'react-spinners/PropagateLoader';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { currency } from '../constants';
import CountdownTimer from '../components/CountdownTimer';
import toast from "react-hot-toast";
import Marquee from"react-fast-marquee"
import AdminControls from '../components/AdminControls';

const Home: NextPage = () => {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  // const address = "0x261a011C79256e2E01873bC80DE086100819DEcC"
  const {contract , isLoading} =useContract(process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS);
  const [quantity, setQuantity] = useState<number>(1);

  const {data: remainingTickets}= useContractRead(
    contract, "RemainingTickets"
  );

  const {data: currentWinningReward}= useContractRead(
    contract, "CurrentWinningReward"
  );
  
  const {data: ticketPrice}= useContractRead(
    contract, "ticketPrice"
  );

  const {data: ticketCommission}= useContractRead(
    contract, "ticketCommission"
  );

  const {data: tickets} = useContractRead(contract , "getTickets");

  const {data: expiration}= useContractRead(
    contract, "expiration"
  );
  
  const {mutateAsync: BuyTickets} = useContractWrite(contract, "BuyTickets");

  const{data: winnings} = useContractRead (contract, "getWinningsForAddress", address);

  const{mutateAsync: WithdrawWinnings} = useContractWrite(
    contract,
    "WithdrawWinnings"
  );
// READ =DATA
// Write = Call
  const{data: lastWinner} = useContractRead(
    contract,
    "lastWinnerAmount"
  );

  const{ data: lastWinnerAmount} = useContractRead(
    contract,
    "lastWinnerAmount"
  );

  const{data: isLotteryOperator} =useContractRead(
    contract,
    "lotteryOperator"
  );

  useEffect(()=>{
    if(!tickets) return;

    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce((total , ticketAddress )=>(ticketAddress === address ? total + 1 : total),
    0
    );

    setUserTickets(noOfUserTickets);
  }, [tickets, address])

  // console.log(userTickets);


  const handleClick = async () =>{
    if(!ticketPrice) return;

    const notifications = toast.loading("Buying your tickets...")
    try{
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (Number(ethers.utils.formatEther(ticketPrice)) * quantity).toString()
            ),
        }
      ]);

      toast.success("Tickets purchased successfully!",{
        id:notifications,
      });

    }catch(err){
      toast.error("OOPS something went wrong!", {
        id: notifications,
      });
      console.error("Contract call failure" , err);
    }
  };

  const onWithdrawWinnings = async ()=>{
    const notification = toast.loading("Withdrawing your winnings...")

    try{
      const data = await WithdrawWinnings([{}]);

      toast.success("Winnings withdrawn successfully!",{
        id:notification,
      });
    }catch(err){
      toast.error("OOPS something went wrong!",{
        id: notification,
      });
      console.error("Contract call failure", err);
    }
  }


  if(isLoading) return <Loading/>
  if(!address) return (<Login/>)
  return (
    <div className=" to bg-gray-600 bg-gradient-to-br from-black min-h-screen flex flex-col">
      <Head>
        <title>SweepStakers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex-1'>
      <Header/>
      <Marquee className='bg-[#4d4949]' gradient={false} speed={100}>
        <div className='flex space-x-2 mx-10'>
          <h4 className=' text-white font-bold'>Last Winner: {lastWinner?.toString()}</h4>
          <h4 className=' text-white font-bold'>| Previous Winnings: {lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}
          {currency}
          </h4>
        </div>
      </Marquee>

      {isLotteryOperator === address &&(
        <div className=' flex justify-center'>
          <AdminControls/>
        </div>
      )}

      {winnings >0 && (
        <div className=' max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
          <button
          onClick={onWithdrawWinnings}
          className=' p-5 bg-gradient-to-l from-green-800 to bg-emerald-500 
            text-center rounded-xl w-full hover:bg-emerald-700'>
            <p className=' text-xl font-bold'>Congratulations SweepStakers You have Won the Draw!</p>
            <p>Total Winnings: {ethers.utils.formatEther(winnings.toString())}{" "}
            {currency}
            </p>
            <br />
            <p className=' font-semibold'>Click here to Withdraw</p>
          </button>
        </div>
      )}{
 
      }

      {/* NextDraw */}
      <div className=' space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
        <div className=' stats-container'>
          <h1 className=' text-5xl text-white font-semibold text-center'>Next Draw</h1>
        <div className=' flex justify-between p-2 space-x-2 '>
          <div className=' stats'>
            <h2 className=' text-sm'>Total PooL</h2>
            <p className=' text-xl'>
              {currentWinningReward && 
              ethers.utils.formatEther(
              currentWinningReward.toString()
            )}{" "}{currency}</p>
          </div>
          <div className="stats">
            <h2 className=' text-sm'>Tickets Remaining</h2>
            <p className=' text-xl'>{remainingTickets?.toNumber()}</p>
          </div>
        </div>

        {/* CountDown */}
        <div className=' mt-5 mb-3'>
          <CountdownTimer></CountdownTimer>
        </div>

        </div>
        <div className=' stats-container space-y-2'>
          <div className="stats-container">
          <div className=' flex justify-between items-center text-white pb-2'>
            <h2 className=' text-sm'>Price per ticket</h2>
            <p className=' text-xl'>
              {ticketPrice && 
              ethers.utils.formatEther(
              ticketPrice.toString()
            )}{" "}{currency}</p>
          </div>

          <div className=' flex text-white items-center space-x-2 bg-zinc-900 border-[#5c5858] border p-4'>
            <p>TICKETS</p>
            <input 
            className='flex w-full bg-transparent text-right outline-[#5c5858]' 
            type="number"
            min={1}
            max={10} 
            value={quantity}
            onChange = {(e)=> setQuantity(Number(e.target.value))}
            />
          </div>
          <div className=' space-y-2 mt-5'>
            <div className='flex items-center justify-between text-gray-400 text-sm italic font-bold'>
              <p>Total cost of tickets</p>
              <p>
                {ticketPrice && 
                Number(
                  ethers.utils.formatEther(ticketPrice?.toString())
                )* quantity}{" "}
                {currency}
              </p>
            </div>
            <div className=' flex items-center justify-between text-gray-400 text-xs italic font-semibold'>
              <p>Service fees</p>
              <p>{ticketCommission && 
              ethers.utils.formatEther(
              ticketCommission.toString()
            )}{" "}{currency}</p>
            </div>
            <div className=' flex items-center justify-between text-gray-400 text-xs italic font-semibold'>
              <p>+ Network fees</p>
              <p>TBC</p>
            </div>
          </div>
          <button 
          onClick={handleClick}
          disabled = {expiration?.toString() < Date.now().toString() || remainingTickets?.toNumber() ===0 }
          className=' mt-5 w-full bg-gradient-to-br from-green-800 to-emerald-800 px-10 py-5 rounded-md font-semibold text-white shadow-xl disabled: from-gray-800 disabled:to-gray-200 disabled:text-black disabled:font-semibold disabled:cursor-not-allowed'>Buy {quantity} Tickets for {ticketPrice && Number(ethers.utils.formatEther(ticketPrice.toString()))*quantity}{' '} {currency}</button>
          </div>
          {userTickets > 0 && (
            <div className='stats'>
              <p className=' text-emerald-700 mb-3 italic text-xl text-center '>You Have {userTickets} in this draw.</p>
              <div className='flex max-w-sm flex-wrap gap-x-2 gap-y-2'>
                {Array(userTickets)
                .fill("")
                .map((_, index) => (
                  <p key={index}
                  className="text-white bg-[#5c5858] h-20 w-12 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic "
                  >{index  + 1}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <footer className=' border-t border-black flex items-center text-white justify-between p-5'>
        <img className=' h-10 w-10 filter hue-rotate-90 opacity-40 rounded-full' 
        src= "https://media.istockphoto.com/vectors/realistic-3d-spinning-fortune-wheel-lucky-roulette-vector-vector-id680501008?k=20&m=680501008&s=612x612&w=0&h=WNbUp3_wKpPP6jHw3cxvWOM_CxF1uO0CR6c9Ee7f8n8=" 
        alt="Disclaimer" />
        <p className=' text-xs text-white pl-5 opacity-40'>
          DISCLAIMER: This website is purly created for demonstrating advantages of decentralized database over centralized and how it is more secure. This is a College Project with a short lucky draw game where money used for transactions will be dummy money or testnet crypto currency which has no real value.
        </p>
      </footer>
    </div>
  );
};
export default Home
