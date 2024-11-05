import React from 'react'
import SideBar from '../SideBar/SideBar'
import DataTable5 from '../Grids/TourismGovernerGrid'

const TourismGovernerAdmin = () => {
    return (
        <div style={{ display: 'flex' }}>
            <SideBar />
            <div style={{ marginLeft: '250px', padding: '20px' }}> {/* Adjust the margin */}
                <DataTable5/>
            </div>
        </div>
    )
}

export default TourismGovernerAdmin;
