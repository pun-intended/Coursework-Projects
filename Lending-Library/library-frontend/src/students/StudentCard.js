// Name, class, Book cover if they have checked out
// book - onClick ->BookDetails
import React, {useState} from "react"
import { Button } from 'reactstrap'
import CheckOutStudent from "./CheckOutStudent"
import CheckInModal from "../books/CheckInModal"


const StudentCard = ({student, setUpdate}) => {
    
    const [outModal, setOutModal] = useState(false);
    const [inModal, setInModal] = useState(false);
    const toggleOut = () => { setOutModal(!outModal)};
    const toggleIn = () => { setInModal(!inModal)};
    
    return(
        <tr>
            <td>{student.first_name} {student.last_name}</td>
            
            {student.book_id && 
                <td><Button className="btn" color="secondary" onClick={toggleIn}> Check in </Button></td>
            }

            {!student.book_id &&
                <td><Button className="btn" color="primary" onClick={toggleOut}> Check out </Button></td>}

            <td>{student.title}</td>
            <td>{student.borrow_date}</td>
            {outModal && <CheckOutStudent modal={outModal} toggle={toggleOut} student={student} setUpdate={setUpdate}/>}
            {inModal && <CheckInModal modal={inModal} toggle={toggleIn} book_id={student.book_id} setUpdate={setUpdate}/>}
        </tr>
            
        
    )
}

export default StudentCard;