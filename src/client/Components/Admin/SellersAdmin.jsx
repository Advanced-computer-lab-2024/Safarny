import React from 'react'
import SideBar from '../SideBar/SideBar'
import DataTable3 from '../Grids/SellerGrid'

const SellersAdmin = () => {
  return (
    <div style={{ display: 'flex' }}>
    <SideBar />
    <div style={{ marginLeft: '80px', padding: '20px' }}> {/* Adjust the margin */}
      <DataTable3/>
    </div>
  </div>
  )
}

export default SellersAdmin
