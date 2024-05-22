import React, { useContext, useState } from "react"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container, Col, Row, Input, FormGroup, Alert } from 'reactstrap'
import {DatePicker} from "reactstrap-date-picker"
import "./CheckOutModal.css"
import StudentContext from "../StudentContext";
import LibraryApi from "../api";
import { v4 as uuid } from "uuid"
import AlertContext from "../AlertContext";


const CheckOutModal = ({modal, toggle, book, setUpdate}) => {

    const {students} = useContext(StudentContext)
    const {addAlert} = useContext(AlertContext)
    const [student, setStudent] = useState("")

    const INITIAL_STATE = {
        'student_id': null,
        'date': new Date().toISOString().slice(0, 10),
        'book_id': book.id.toString()
    }

    const[formData, setFormData] = useState(INITIAL_STATE)

    const handleSubmit = (evt) => {
        evt.preventDefault()
        try{
            console.log(formData)
            LibraryApi.checkOut(formData)
            setFormData(INITIAL_STATE)
            addAlert(`Checked out book ${book.title} to ${student}`, 'success')
            setUpdate(true);
            toggle()
        } catch(e){
            console.log(e)
        }
    }

    const handleDateChange = (v, f) => {
        console.log(`v - ${v}`)
        console.log(`f - ${f}`)
        setFormData(fData => ({
            ...fData,
            'date': f
        }));
    }

    const handleChange = (evt) => {
        const { name, value, selectedIndex, options } = evt.target
        setStudent(options[selectedIndex].innerText)
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
        // setStudent(innerText) 
    }

    return(
        <Modal isOpen={modal} toggle={toggle} backdrop={true}>
            <ModalHeader toggle={toggle}>
                Check-Out - {`${book.title}`}
            </ModalHeader>
            <ModalBody>
                <Container>
                    <Row>
                        <Col>
                            <img src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`} 
                                alt={`${book.title}`}/>
                        </Col>
                        <Col>
                        <FormGroup id="checkoutForm">
                            <Input  type="select" 
                                    name="student_id" 
                                    id="student_id" 
                                    value={formData.student_id}
                                    onChange={handleChange}>
                                        <option>--Select Student</option>
                                        {students.map(st => {
                                        if((!st.book_id && !st.has_read) || (!st.book_id && !(st.has_read.includes(book.id)))){
                                            return (
                                            <option value={parseInt(st.id)} key={uuid()}>
                                                {st.first_name} {st.last_name}
                                            </option>
                                        )}
                                })}
                            </Input>
                            <DatePicker name="date" 
                                        id="datePicker"
                                        defaultValue={formData.date}
                                        dateFormat="YYYY-MM-DD"
                                        placeholder="YYYY-MM-DD"
                                        onChange={handleDateChange}
                                        disabled={!formData.student_id}
                                        />
                        </FormGroup>
                        </Col>
                    </Row>
                </Container>
            </ModalBody>
            <ModalFooter>
                <Button disabled= {!formData.student_id} className="submitBtn" color="primary" onClick={handleSubmit}>Check Out</Button>
                <Button className="cancelBtn" color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}

export default CheckOutModal;

