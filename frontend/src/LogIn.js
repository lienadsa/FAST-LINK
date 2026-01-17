import './App.css';
import { useNavigate } from 'react-router-dom';
import {React, useEffect, useState} from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

function LogInPage() { 
    const navigate = useNavigate();
    const [input, setInput] = useState({email: '', password: ''});


  function Update(event) {
    const { name, value } = event.target;
    setInput(prevInput => ({
      ...prevInput,
      [name]: value
    }));
  }
  
  async function Verify(event) {
        event.preventDefault();

            try {
              const res = await axios.post(`${process.env.BACKEND_BASE_URL}/login`, {
                email: input.email,
                password: input.password
              }, { withCredentials: true });

              if (res.data.success){
                const user = res.data.userId;
                navigate(`/${user}/dashboard`);

              } else {
                alert("log in failed. Please try again.");
              }
            } catch (error) {
              console.error("Error signing up:", error);
              alert("Log in failed. Please try again.");
            }
          }
          
          
     return (

        
        <div style={{backgroundColor: "#FF6D1F" , height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
         <h1 style={{fontSize: "30px", color: "#171010", }}>FASTLINK</h1> 
          <h1 style={{fontSize: "30px", color: "#FF6D1F", }}>FASTLINK</h1> 
         
          <form onSubmit={Verify}>
  <div className="form-group">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" name="email" value={input.email} onChange={Update} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" name="password" value={input.password} onChange={Update}/>
  </div>
  <div className="form-check">
  </div>
  <button type="submit" className="btn btn-outline-dark" >Log in</button>
</form>   
        </div>
    )
}


export default LogInPage;