import React from 'react'
import SideBar from '../SideBar'
import TourismGrid from '../Grids/TourismgovernorGrid.jsx'
//import './TourismGovernorAdmin.css'

const TourismGovernorAdmin = () => {
  return (
    <div className="tourism-admin-container">
      <SideBar />
      <div className="tourism-admin-content">
        <TourismGrid />
      </div>
    </div>
  )
}

export default TourismGovernorAdmin
