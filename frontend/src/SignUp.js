import './App.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';

function SignUpPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState({ email: '', password: '' });
  

  
  function Update(event) {
    const { name, value } = event.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function Verify(event) {
    event.preventDefault();

    try {
      const res = await axios.post(`${process.env.BACKEND_BASE_URL}/signup`, {
        email: input.email,
        password: input.password
      });

      if (res.data.success) {
        alert("Sign-up successful! Please log in.");
        navigate('/login');
      } else {
        alert(`Sign-up failed. ${res.data.message}.`);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Sign-up failed. Please try again.");
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
  <button type="submit" className="btn btn-outline-dark" >Sign Up</button>
</form>   
        </div>
  );
}

export default SignUpPage;
