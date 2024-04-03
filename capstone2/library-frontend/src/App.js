import './App.css';
import LibraryApi from './api';
import React, { useEffect, useState } from 'react';
import NavBar from "./NavBar"
import RouteList from "./RouteList"
import UserContext from "./UserContext.js"
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from './useLocalStorage';
import { jwtDecode } from 'jwt-decode';
import StudentContext from './StudentContext.js';
import AlertContext from './AlertContext.js';
import {Container} from "reactstrap"
import { v4 as uuidv4} from "uuid";
import DismissableAlert from './DismissableAlert.js';

function App() {
  const [token, setToken] = useLocalStorage('token', '')
  const [currentUser, setCurrentUser] = useLocalStorage('currentUser', '')
  const [students, setStudents] = useState([])
  const [alerts, setAlerts] = useState([])

  function addAlert(message, color = "primary"){
    const newAlert = {
      message: message,
      color: color,
      id: uuidv4()
    }
    const newAlerts = [...alerts, newAlert]
    setAlerts(newAlerts)
  }

  function removeAlert(id){
    const alert = document.getElementById(id)
    const filtered = alerts.filter((alert) => {
      return (alert.id != id)
    })
    setAlerts(filtered)
  }

  async function login(data) {
    try{
      const newToken = await LibraryApi.login(data);
      console.log(`token - ${newToken}`)
      setToken(newToken)
      if(newToken){
        addAlert("Welcome Back"); // Set alert message to welcome
      }
    }catch(e){
      addAlert("Login Failed", "danger")
    }
  }

  function logout() {
    setToken("")
    setCurrentUser("")
  }

  async function signup(data) {
    const newToken = await LibraryApi.register(data)
    setToken(newToken)
  }
  async function patchUser(data){
    const newUser = LibraryApi.patchUser(data);
    setCurrentUser(newUser);
  }

  useEffect(() => {
    async function updateUser() {
      if(token.length > 0){
        try{
          const decodedToken = jwtDecode(token)
          const id = decodedToken.id
          const user = await LibraryApi.getUser(id)
          setCurrentUser(user)
        } catch (e) {
          console.log(`Token Error: ${e}`)
        }}
    }
    updateUser()
  },[token])

  useEffect(() => {
    async function populateStudents() {
      if(token.length > 0){
        try{
          const Ss = await LibraryApi.getAllStudents()
          setStudents(Ss)
        }catch(e){
          console.log(`Error Loading Students: ${e}`)
        }
      }
    }
    populateStudents()
  },[token])

  return (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <StudentContext.Provider value={{students, setStudents}}>
          <AlertContext.Provider value={{alerts, setAlerts, addAlert, removeAlert}}>
        <BrowserRouter>
          <NavBar />
          <Container size="md">
          {
            alerts.map((alert) => {
              return(
                DismissableAlert(alert.message, alert.color, alert.id, removeAlert)
              )
            })
          }
          </Container>
          {/* <RouteList login={login} signup={signup} patchUser={patchUser} setToken={setToken} setCurrentUser={setCurrentUser}/> */}
          <RouteList login={login} logout={logout}/>

        </BrowserRouter>
        </AlertContext.Provider>
        </StudentContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;

// TODO - Function - Add admin levels - School, company
/**
 * Add admin level selector
 * update API sql calls
 * 
 * 
 * 
 * School admin 
 * - change roster
 * - set teacher class
 * - Change student school
 * - change student class
 * - Student page, new year page (all students in level - needs age field), new K1 page
 * 
 * 
 * Company admin
 * - Add teachers
 * - Change teacher school
 * - change books in stage
 */
// TODO - Fix CSS
// TODO - Function - add id to booklist
// TODO - function - add qr code functionality
// TODO - cosmetic - add container for alerts so things dont shift on removal
// TODO - cosmetic - Set default image for image not found
/**
 * remove image on mobile
 * shrink text to fit screen
 * center align items
 * responsive size for inputs in login
 * 
 * After QR Scan func
 * - add set of books
 *    - Select stage
 * - create new QR code set
 */