import './App.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import dotenv from 'dotenv';

function HomePage () {
    const navigate = useNavigate();

    async function Navigation(event) {
        
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/isauthenticated`,{}, { withCredentials: true });
        if (res.data.success) {
          navigate(`/${res.data.userId}/dashboard`);
        } else {
            navigate(`/${event.target.name}`);
    }
      } 
      catch (error) {
        console.log("User not authenticated");
      }
    }


    return (

      <div className="home">
      <div className="menu"><h1 style={{fontSize: "30px", color: "#F5E7C6", }}>FASTLINK</h1></div>
      <div className="content">
        <h1 style={{color: "#222222", fontSize: "105px" , fontWeight: "900" ,  marginTop: "100px"}}>THE</h1> 
        <h1 style={{color: "#222222", fontSize: "105px" , fontWeight: "900"}}>LINKTREE</h1>
        <h1 style={{color: "#222222", fontSize: "105px" , fontWeight: "900"}}>GENERATOR</h1>
        <h1 style={{color: "#222222", fontSize: "105px" , fontWeight: "900" }}>MADE FOR</h1>
        <h1 style={{color: "#222222", fontSize: "105px" , fontWeight: "900"}}>ARTISTS.</h1>
      <div style={{display: "flex" , flexDirection: "row", justifyContent: "space-between" , marginTop: "50px" , marginBottom: "50px"}}><button style={{marginRight: "10px" }} type="button" className="btn btn-outline-dark" name="signup" onClick={Navigation}>Sign Up</button>
      <button style={{marginLeft: "10px"}} type="button" className="btn btn-dark" name="login" onClick={Navigation}>Log in</button></div>
      </div>
        
      </div>

    );
}

export default HomePage;