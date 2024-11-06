import React from 'react'
import SideBar from '../SideBar/SideBar'
import DataTable4 from '../Grids/AdvertiserGrid'

const AdvertisersAdmin = () => {
  return (
    <div style={{ display: 'flex' }}>
    <SideBar />
    <div style={{ marginLeft: '250px', padding: '20px' }}> {/* Adjust the margin */}
      <DataTable4/>
    </div>
  </div>
  )
}

export default AdvertisersAdmin
