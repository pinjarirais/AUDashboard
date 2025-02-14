import React from 'react'

function Dashboard() {
  return (
    <>
     
      <div className='px-10'>
        <div className='dashboard-wrap'>
          <div className='flex flex-auto justify-between border-b-[1px] py-5 align-middle'>
            <div>
              <h1 className='text-[22px] bold'>Dashboard</h1>
            </div>
            <div className='top-search'>
              <input type='text' placeholder='Search'
              className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6d3078]-500 focus:border-[#6d3078]-500'></input>
            </div>
          </div>
          
          <div className='py-10'>
            <p className='text-center'>Coming soon...</p>
            <p></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
