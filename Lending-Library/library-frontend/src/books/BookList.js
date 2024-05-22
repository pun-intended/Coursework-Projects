// List all books available -> book card
// List all books checked out -> book card
// Click available book to show checkout card

import React, { useEffect, useState, useContext } from "react"
import BookCard from "./BookCard";
import LibraryApi from "../api";
import {Container, Col, CardGroup} from 'reactstrap'
import StudentContext from "../StudentContext";
import "./BookList.css"
import UserContext from "../UserContext";

// TODO - Move books/update out, pass books as param to make {outstanding} {all books} {available} list
const BookList = () => {
    const {setStudents} = useContext(StudentContext)
    const {currentUser} = useContext(UserContext)
    const [books, setBooks] = useState([])
    const [update, setUpdate] = useState(false)
    useEffect( () => {
        async function initializeList(){
            const updateBooks = await LibraryApi.getAllBooks(currentUser.school_id)
            const updateStudents = await LibraryApi.getAllStudents()
            setBooks(updateBooks)
            setStudents(updateStudents)
            setUpdate(false)
        }
        initializeList()
    }, [update])

    return(
        <Container className="BookList">
            <h1>All Books</h1>
                <CardGroup> 
                    {books.map((book) => {
                        return(
                        <Col className="BookCard" xs="2">
                            <BookCard book={book} setUpdate={setUpdate} key={book.isbn}/>
                        </Col>
                        )
                    })}
                </CardGroup>     
        </Container>
    )
}

export default BookList;