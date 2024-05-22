import {React, useContext, useState} from "react";
import {useNavigate} from "react-router-dom"
import {Form, FormGroup, Label, Input, Container, Button} from "reactstrap"
import AlertContext from "../AlertContext";

const LoginForm = ({login}) => {
    
    const INITIAL_STATE = {
        id: "",
        password: ""
    }
    const navigate = useNavigate()
    const {addAlert} = useContext(AlertContext)

    const[formData, setFormData] = useState(INITIAL_STATE)

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        try{
            await login(formData)
            console.log(localStorage.token.length > 2)
            console.log(localStorage.token.length)
            console.log(localStorage.token)
            setFormData(INITIAL_STATE)
            if(localStorage.token.length > 2){
                addAlert("Welcome Back")
                navigate("/")
            }
        } catch(e){
            console.debug(e)
        }

    }

    const handleChange = evt => {
        const { name, value } = evt.target
        setFormData(fData => ({
            ...fData,
            [name]: value
        }));
    }
    return(
    <Container className="LoginForm" >
        <Form onSubmit={handleSubmit} >
            <FormGroup > 
                <Label for="id">ID</ Label>
                <Input id="id"
                    name="id"
                    placeholder="ID"
                    type="text"
                    onChange={handleChange} 
                    value={formData.id}
                    />
                <Label for="password">Password</Label>
                <Input id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    onChange={handleChange} 
                    value={formData.password} />
            </FormGroup>
            <Button>Login</Button>
        </Form>
    </Container>
    )
}

export default LoginForm;