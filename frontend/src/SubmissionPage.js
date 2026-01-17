import './App.css';
import { useState } from 'react';
import { useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function SubmissionPage() {

    const [isrc, setIsrc] = useState("");
    const [isValid, setIsValid] = useState(null); 
    const [isChecking, setIsChecking] = useState(false);
    const {user_id} = useParams();
  
    async function handleSubmit(event) {
        event.preventDefault();

       if (!isValid){
        alert("Please enter a valid ISRC before submitting.");
       } else {
        setIsChecking(true);
        
        try { 
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/deezer/track/${isrc}`, {user_id : user_id});
            if (response.data.success) {
            setIsChecking(false);
            alert("ISRC verified successfully and release has been successfully generated!");
            console.log(response.data);
        } else {
            alert("release generation failed. " + response.data.message);
            return;
        }
        } catch (error) {
            alert("Error verifying ISRC:" + error.message);
            return;
        }

        }


    }
    function handleChange(event) {
        const inputIsrc = event.target.value;
        setIsrc(inputIsrc);
        const isrcPattern = /^[A-Z]{2}-?[A-Z0-9]{3}-?\d{2}-?\d{5}$/i;
        const isrcPattern2 = /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/i;

        setIsValid(isrcPattern.test(inputIsrc) || isrcPattern2.test(inputIsrc));

        

    }


    return (
        <div className="container" style={{backgroundColor: "#FF6D1F"}}>
        <div className="mb-3">
        <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="isrc" className="form-label">
          <h1 style={{color: "#000000ff"}}>ISRC:</h1>
        </label>

        <input
          type="text"
          id="isrc"
          name="isrc"
          className="form-control"
          placeholder="Type in ISRC number"
          value={isrc}
          onChange={handleChange}
        />
        <h5>{isrc && (isValid? "✅ Valid format" : "❌ Invalid format")}</h5>
      </div>

      <button type="submit" className="btn btn-outline-dark" style={{backgroundColor: "#000000ff"}}>
        Submit
      </button>
    </form>
         </div>   
        </div>
    )
}

export default SubmissionPage;