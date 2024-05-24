// Show all students in class -> Student Card
// Dropdown menu for class
import React from "react"
import StudentCard from "./StudentCard";
import { useState, useEffect, useContext } from "react";
import LibraryApi from "../api";
import {Container, Table } from 'reactstrap'
import "./StudentCard.css";
import StudentContext from "../StudentContext";
import UserContext from "../UserContext";

const StudentList = () => {
    const [update, setUpdate] = useState(false)
    const {students, setStudents} = useContext(StudentContext)
    const currentUser = useContext(UserContext)
    
    useEffect( () => {
        async function initializeList(){
            console.log(currentUser)
            let role = currentUser.role;
            let allStudents
            if(role === "master_admin"){
                allStudents = await LibraryApi.getAllStudents()
            } else if(role === "school_admin"){
                allStudents = await LibraryApi.getStudentsBySchool(currentUser.school_id);
            } else if(role === "user"){
                console.log(currentUser.class_id)
                allStudents = await LibraryApi.getStudentsByClass(currentUser.class_id)
            }
            setStudents(allStudents)
            setUpdate(false)
        }
        initializeList()
    }, [update])

    return(
        <div className="StudentList">
            <Container>
                <h1> school name - class name </h1>
                <Table hover striped>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th></th>
                            <th>Book</th>
                            <th>Borrow Date</th>
                        </tr>
                    </thead>
                    <tbody>
                {students.map((st) =>  {
                    return (
                        <StudentCard student={st} setUpdate={setUpdate} key={st.id}/>
                    )})}
                    </tbody>
                </Table>
            </Container>
            
        </div>
    )
}

export default StudentList;