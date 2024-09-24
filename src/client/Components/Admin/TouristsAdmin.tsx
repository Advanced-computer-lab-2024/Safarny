// import React from 'react'
import SideBar from '../../components/SideBar'
import DataTable from '../../components/Grids/GridCol'

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
