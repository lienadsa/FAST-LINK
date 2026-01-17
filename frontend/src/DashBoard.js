import './App.css';
import spotifyIcon from './spotify-icon.svg';
import applemusicIcon from './icons8-apple-music.svg';
import soundcloudIcon from './icons8-soundcloud.svg';
import youtubeIcon from './icons8-youtube.svg';
import redirect from './redirect2.svg';
import link from './redirect3.svg';
import trash from './icons8-trash.svg';
import plus from './plius.svg';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function DashBoard() {
   // let img = "https://linkstorage.linkfire.com/medialinks/images/d6e7bba0-7d0f-4d83-ab77-d6b339179a54/artwork-440x440.jpg";
    const {user_id} = useParams();
    const navigate = useNavigate();

    const [releases, setReleases] = useState([]);
    const [isauthenticated, setIsauthenticated] = useState(false);

useEffect(() => {
  const controller = new AbortController();

  const fetchReleases = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/dashboard`,
        {
          params: { user_id },
          signal: controller.signal,
          withCredentials: true,
        }
      );

      const data = response.data;
      if (data.success) {
        if (data.data) {
          setReleases(data.data);
        } else {
          setReleases([]);
        }
        setIsauthenticated(true);
        console.log("Releases fetched:", data.data);
      } else {
        alert("Failed to fetch releases: " + data.message);
        console.log("User not authenticated, redirecting to login.");
        navigate('/login');
      }
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error("Error fetching releases:", error);
        navigate('/login');
      }
    }
  };

  fetchReleases();

  return () => {
    controller.abort(); 
  };
}, [user_id]);

    function navigateToLogin() {
      navigate('/login');
   
         }

    
    function Release() {
        navigate(`/${user_id}/:release_id`);
    }

    function NewRelease(event) {
        event.preventDefault();
        navigate(`/${user_id}/submission`);
    }

    async function Delete(event) {
        event.preventDefault();
        const release_id = event.target.getAttribute("name");
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/delete`, {
            params: { user_id, release_id }
        });
        const data = response.data;
        if (data.success) {
            alert("Release deleted successfully");
            window.location.reload();
    }
        else {
            alert("Failed to delete release: " + data.message);
        }
      };

    return (
    (releases.length > 0) ? (
      <div style={{display: "flex", flexDirection: "column" , justifyContent: "flex-start" , width: "100vw", height: "100vh" , backgroundColor: "#FF6D1F" }}>
    <div style= {{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
            <form className="form-inline">
    <input style={{order: "1"}} className="form-control-sm mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
    <button style={{order: "1"}}  className="btn btn-outline-dark my-2 my-sm-0" type="submit">Search Releases</button>
            </form>
   </div>
   <div className="content" style={{paddingBottom: "30px"}}>
    <h1 style={{color: "black"}}>Dashboard</h1>
   <div style={{display: "flex" , flexDirection: "column" , justifyContent: "center", alignContent: "center"}} onClick={NewRelease}><img src={plus} style={{width: "200px", height: "200px"}}/></div>
   <div className="d-flex justify-content-center" style={{width: "80vw", marginLeft: "10vw" , marginRight: "10vw" }}>
  <table style={{order: 1 }} className="table mx-auto table-borderless table-dark table-hover">
  <thead>
    <tr>
      <th scope="col">ISRC</th>
      <th scope="col">RELEASE</th>
      <th scope="col">Views</th>
      <th scope="col"><img src={spotifyIcon} style={{width: "20px", height: "20px"}}/></th>
      <th scope="col"><img src={applemusicIcon} style={{width: "20px", height: "20px"}}/></th>
      <th scope="col"><img src={soundcloudIcon} style={{width: "20px", height: "20px"}}/></th>
      <th scope="col"><img src={youtubeIcon} style={{width: "20px", height: "20px"}}/></th>
      <th scope="col"><img src={redirect} style={{width: "20px", height: "20px"}}/></th>
      <th scope="col"><h5 style={{color: "#212529"}}>D</h5></th>
      
    </tr>
  </thead>
  <tbody>
    {releases.map((release) => (
      <tr>
      <th scope="row">{release.isrc}</th>
      <td>{release.title}</td>
      <td>{release.views}</td>
      <td>{release.spotifyclicks}</td>
      <td>{release.applemusicclicks}</td>
      <td>{release.soundcloudclicks}</td>
      <td>{release.youtubeclicks}</td>
      <td><a href={`/${user_id}/${release.release_id}`}><h1 style={{fontSize: "15px"}} >View Page</h1></a></td>
      <td><img onClick={Delete} name={release.release_id} src={trash} style={{width: "20px", height: "20px" , marginTop: "0px"}}/></td>
    </tr>))}
   </tbody>
  </table>
    </div>
   <button style={{marginTop: "20px"}} className="btn btn-outline-dark" onClick={ async() => { const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/logout`, { withCredentials: true }); if (res.status === 200) {navigateToLogin();} else {console.log("Logout failed");}}}>Log out</button>
    </div>
    </div>
     ) : (
      <div style={{backgroundColor: "#FF6D1F" , height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    <div style={{display: "flex" , flexDirection: "column" , justifyContent: "center", alignContent: "center"}} onClick={NewRelease}><img src={plus} style={{width: "200px", height: "200px"}}/></div>
    <h1 style={{color: "black"}}>Dashboard is empty. Create a new release!</h1>
    <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}><button style={{ marginTop: "20px"}} className="btn btn-outline-dark" onClick={ async() => { const res = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/logout`,{} , { withCredentials: true }); if (res.status === 200) {navigateToLogin();}}}>Log out</button>
    </div>
    </div>
     )
     

    
    )
}

export default DashBoard;