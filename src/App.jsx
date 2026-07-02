import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./Login";
import axios from "axios";
import { useNavigate } from 'react-router'

function App() {
  let navigate=useNavigate();
  const [isSubmitted,setisSubmitted]=useState(false);
  const API_Url="http://localhost:3000"
 async function handleRegister(data){
  try {
    const result= await axios.post(`${API_Url}/register`,data);
    if(result.status==200){
      navigate("/dashboard");
    }
  } catch (error) {
    console.error("Registration failed", error);
    alert("Registration failed. Email might already exist.");
  }
}

 async function handleLogin(data){
  try {
     const result= await axios.post(`${API_Url}/login`,{
      email:data.email,
      password:data.password,
     });
    if(result.status==200){
      navigate("/dashboard");
    }
  } catch (error) {
    console.error("Login failed", error);
    alert( "Invalid credentials");
  }
 }
  return(
    <div>
    <Login onRegister={handleRegister} onLogin={handleLogin}/>
    </div>
  )
}

export default App;
