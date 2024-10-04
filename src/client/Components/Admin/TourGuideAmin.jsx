// import React from 'react'
import SideBar from '../SideBar'
import DataTable2 from '../Grids/TourGuideGrid'

const TourGuideAmin = () => {
  return (
    <div style={{ display: 'flex' }}>
      <SideBar />
      <div style={{ marginLeft: '250px', padding: '20px' }}> {/* Adjust the margin */}
        <DataTable2/>
      </div>
    </div>
  )
}

export default TourGuideAmin
