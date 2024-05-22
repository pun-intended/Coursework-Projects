import React, { useEffect, useState, useContext } from "react"
import { Button } from "reactstrap"

const Landing = ({setToken}) => {

    function handleClick(evt){
        console.log("token chosen")
        const target = evt.target

        setToken(target.value)
    }

    return (
        <div>
            <h2>Welcome to The Library!</h2>
            <Button color="primary" value={user} onClick={handleClick}>User</Button>
            <Button color="success" value={school_admin} onClick={handleClick}>School Admin</Button>
            <Button color="danger" value={master_admin} onClick={handleClick}>Master</Button>
        </div>
    )
}

let user = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDEsInJvbGUiOiJ1c2VyIn0.oRPWvziiTq-viEm_-oNoW1kcaQFh8QSnnFYMQcu_smk`
let school_admin = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDIsInJvbGUiOiJzY2hvb2xfYWRtaW4ifQ._JbuOzi8zEggsCFHnPQSptM8VKzm_-OPlzBA5FY0o4w`
let master_admin = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDMsInJvbGUiOiJtYXN0ZXJfYWRtaW4ifQ.s-_rwrwLNiKGXlDCLdqDR4g_CLiomu9Iv7bR1b-f77s`

export default Landing