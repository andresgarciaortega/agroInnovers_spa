import React, { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import Component from "../../components/Menu";
import './layout.css'

const LayoutHome = () => {

    return (
        <>
            <Component/>
            {/* <Outlet /> */}
        </>
    )

}


export default LayoutHome;