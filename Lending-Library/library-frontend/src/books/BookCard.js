// Simple card for list
// Cover (l, set height), title, who has, borrowed date
// OnClick function pass
import React, { useState } from "react"
import {Card, CardBody, CardTitle, CardText, Button } from 'reactstrap'
import CheckOutModal from "./CheckOutModal.js";
import CheckInModal from "./CheckInModal.js";

const BookCard = ({book, setUpdate}) => {

    const [outModal, setOutModal] = useState(false);
    const [inModal, setInModal] = useState(false);
    const toggleOut = () => { setOutModal(!outModal)};
    const toggleIn = () => { setInModal(!inModal)};

    return(
        <Card >
            <CardBody>
            <CardTitle tag='h5'>
                {`${book.title}`}
            </CardTitle>
            </CardBody >
            <CardBody >
                <img className="BookCard BookCover" 
                    src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} 
                    alt={`${book.title}`} />
            </CardBody>
            <CardBody >
                <CardText>
                    {!book.available && <Button color="secondary" className="btn-primary" onClick={toggleIn}>Check-in</Button>}
                    {book.available && <Button color="primary" className="btn-primary" onClick={toggleOut}>Check-out</Button>}
                </CardText>
            </CardBody>
           {outModal && <CheckOutModal modal={outModal} toggle={toggleOut} book={book} setUpdate={setUpdate}/>}
           {inModal && <CheckInModal modal={inModal} toggle={toggleIn} book_isbn={book.isbn} setUpdate={setUpdate}/>}
        </Card>
    )
}

export default BookCard