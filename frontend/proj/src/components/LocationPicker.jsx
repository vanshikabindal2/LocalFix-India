import React from 'react'
import { useState } from 'react';
const LocationPicker = ({location,setLocation}) => {
    const [loading,setLoaing]=useState(false);
    const[error,setError]=useState(" ");
    const getCurrentLocation=()=>{
        if(!navigator.geolocation){
            setError("Geolocation is not supported by your browser");
            return;
        }
        setLoading(true);
        setError("");
    navigator.geolocation.getCurrentPosition((position)=>{
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationText=`Latitude:${latitude.toFixed(6)},Longtitude:${longtitude.toFixed(6)}`;
        setLocation(locationText);
        setLoaing(False);


    },()=>{setError("unable to get your location. please allow loaction permission");
        setLoaing(false);
    })    
    }
  return (
    <div className='location-picker'>
        <label>problem loaction</label>
        <div className='location-buttons'>
            <button type="buttom" onclick={getCurrentLocation} disabled={loading}>{loading ?"getting location.....":"use my current location"}</button>

        </div>
      <input type="text" placeholder='enter a location manually' value={location} onChange={(e)=>setLocation(e.target.value)}/>
      {location && (<div className='location-success'>Location Selected: <br/>
      <strong>{location}</strong></div>)}
      {error && (
        <p className='location-error'>❌{error}</p>
      )}
    </div>
  )
}

export default LocationPicker;
