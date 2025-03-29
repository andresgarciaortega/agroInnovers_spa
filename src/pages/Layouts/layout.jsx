import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import Component from "../../components/Menu";
import './layout.css'
import useDataSync from "../../store/asyncDataCronJobs";

const LayoutHome = () => {
    // useDataSync(); // Activamos la lógica de sincronización

    return (
        <>
            <Component/>
            {/* <Outlet /> */}
        </>
    )

}


export default LayoutHome;