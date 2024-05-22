import React  from "react";
import {Navigate} from "react-router-dom"

const LogOut = ({logout}) => {
    logout()

    return(
        <Navigate to="/" />
    )
}

export default LogOut