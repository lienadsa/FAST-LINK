import spotifyIcon from './spotify-icon.svg';
import applemusicIcon from './icons8-apple-music.svg';
import soundcloudIcon from './icons8-soundcloud.svg';
import youtubeIcon from './icons8-youtube.svg';
import './App.css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';




function ReleasePage() {
  
  
   const { user_id, release_id } = useParams();
   console.log("Release Page params:", user_id, release_id);
    const [releaseInfo, setReleaseInfo] = useState(null);
   
    React.useEffect(() => {
      const controller = new AbortController();
    const getReleaseInfo = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/retrieve`, {
    params: {
      user_id : user_id,
      release_id : release_id,
    },
    signal: controller.signal,
  });
        if (response.data.success) {
          
          setReleaseInfo(response.data);
           console.log(response.data);
          
           try {
  const viewResponse = await axios.post(
    `${process.env.REACT_APP_BACKEND_BASE_URL}/views`,
    {
      user_id: user_id,
      release_id: release_id,
    },
    {
      signal: controller.signal,
    }
  );

  console.log("View recorded:", viewResponse.data);
} catch (viewError) {
  console.error("Error recording view:", viewError);
}
}
          
        
          else{ alert(`${response.data.message}`);};
      } catch (error) {
        alert(error.message);
        console.error("Error fetching release info:", error);
      }
    }
    getReleaseInfo();
    console.log("Release info fetched:", releaseInfo);
    return () => {controller.abort();};
  }, [user_id, release_id]);

  function UpdateStats(event) {
    const linkName = event.currentTarget.getAttribute('name');
    axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/stats`, { platformlinkName: linkName, user_id: user_id, release_id: release_id});
  }

  return (
    



       (releaseInfo) ? (<div className="App" style={{backgroundImage: `url(${releaseInfo.data.imageurl})`}}><div className="section">
        <img className="item" style={{ height: "414px", width: "400px"}} alt="artwork" src={releaseInfo.data.imageurl}></img>
       <div className="item2 second" style={{width: "400px" }}>
        <h1>{releaseInfo.data.title}</h1>
        <a href={releaseInfo.data.spotifylink} name="spotifyclicks" className="linkContainer" onClick={UpdateStats}><img style={{ height: "75px", width: "75px", marginBottom: "10px"}} src={spotifyIcon} alt="spotify"/></a>
        <a href={releaseInfo.data.applemusiclink} name="applemusicclicks" onClick={UpdateStats}><img style={{ height: "75px", width: "75px" , marginBottom: "10px" }} src={applemusicIcon} alt="spotify"/></a>
        <a href={releaseInfo.data.soundcloudlink} name="soundcloudclicks" onClick={UpdateStats}><img style={{ height: "75px", width: "75px", marginBottom: "10px"}} src={soundcloudIcon} alt="spotify"/></a>
        <a href={releaseInfo.data.youtubelink} name="youtubeclicks" onClick={UpdateStats}><img style={{ height: "75px", width: "75px", marginBottom: "10px"}} src={youtubeIcon} alt="spotify"/></a>
       </div> 
       </div></div>):(<div style={{backgroundColor: "#FF6D1F" , height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><div><h1 style={{color: "black"}}>Release Linktree not found</h1></div></div>)
       
       
    
  
  );
}

export default ReleasePage;
