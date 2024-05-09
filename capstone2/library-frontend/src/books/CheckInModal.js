import React, { useContext, useEffect, useState } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Col, Row, Input, FormGroup } from 'reactstrap'
import {DatePicker} from "reactstrap-date-picker"
import "./CheckOutModal.css"
import StudentContext from "../StudentContext";
import LibraryApi from "../api";
import AlertContext from "../AlertContext";


const CheckInModal = ({modal, toggle, book_id, setUpdate}) => {

    const [book, setBook] = useState([]);
    const {addAlert} = useContext(AlertContext)

    useEffect(() => {
        async function getBookDetails() {
            const bookDetails = await LibraryApi.getBook(book_id);
            setBook(bookDetails);
        }
        getBookDetails()
    }, []);

    const INITIAL_STATE = {
        'date': new Date().toISOString().slice(0, 10),
        'book_id': book_id.toString(),
        'condition': book.condition || "Great"
    };

    const students = useContext(StudentContext);
    const[formData, setFormData] = useState(INITIAL_STATE);
    
    const handleSubmit = (evt) => {
        evt.preventDefault()
        try{
            console.log(formData);
            LibraryApi.checkIn(formData);
            setFormData(INITIAL_STATE);
            addAlert(`Checked in book ${book.title}`, 'success')
            setUpdate(true);
            toggle();
        } catch(e){
            console.log(e);
        };
    };

    const handleDateChange = (v, f) => {
        setFormData(fData => ({
            ...fData,
            'date': f
        }));
    };

    // For changing condition
    const handleChange = evt => {
        const { name, value } = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
        console.log(formData)
    };

    return(
        <Modal isOpen={modal} toggle={toggle} backdrop={true}>
            <ModalHeader toggle={toggle}>
                Check-In - {`${book.title}`}
            </ModalHeader>
            <ModalBody>
                <Container>
                    <Row>
                        <Col>
                            <img src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} 
                                alt={`${book.title}`}/>
                        </Col>
                        <Col>
                            <h3>Borrowing: </h3>
                            <FormGroup id="checkoutForm">
                            <DatePicker name="date" 
                                        id="datePicker"
                                        value={formData.date}
                                        dateFormat="YYYY-MM-DD"
                                        placeholder="YYYY-MM-DD"
                                        onChange={handleDateChange}
                                        />
                            <Input  type="select"
                                    name="condition"
                                    id="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                            >
                                <option value="poor">
                                    Poor
                                </option>
                                <option value="good">
                                    Good
                                </option>
                                <option value="great">
                                    Great
                                </option>
                            </Input>
                        </FormGroup>
                        </Col>
                    </Row>
                </Container>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>Check In</Button>
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};

export default CheckInModal;

