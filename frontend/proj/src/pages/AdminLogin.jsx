import React from 'react'
import {useNavigate} from "react-router-dom"
import { useState } from 'react';
const AdminLogin = () => {
    const navigate=useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const handleLogin=(e)=>{
        e.preventDefault();
// demo admin credentials
if(email ==="admin@localfix.com" && password ==="admin123"){
    localStorage.setItem("adminLoggedIn","true");
    navigate("/admin");

} else{
    setError("Invalid email or password");
}
    };
  return (
    <div className='admin-login-page'>
        <div className='admin-login-card'>
            <h1>Admin LOgin</h1>
            <p>Login to manage Complaints</p>
            {error &&(<div className='login-error'>{error}</div>)}

            <form onSubmit={handleLogin}>
                <div className='form-group'>
                    <label>Email</label>
                    <input type="email" placeholder='enter admin email' value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                   
                    
                    </div>
                     <div className='form-group'>
                        <label>Password</label>
                    <input type="password" placeholder='enter a password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>

                        </div>

                        <button type="submit" className='login-btn'>Login</button> 
            </form>
           

        </div>
      
    </div>
  )
}

export default AdminLogin
