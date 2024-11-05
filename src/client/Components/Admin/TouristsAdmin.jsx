import React from 'react'
import SideBar from '../SideBar/SideBar'
import DataTable from '../Grids/GridCol'

const TouristsAdmin = () => {
  return (
    <div style={{ display: 'flex' }}>
    <SideBar />
    <div style={{ marginLeft: '250px', padding: '20px' }}> {/* Adjust the margin */}
    <DataTable/>
    </div>
  </div>
  )
}

export default TouristsAdmin
