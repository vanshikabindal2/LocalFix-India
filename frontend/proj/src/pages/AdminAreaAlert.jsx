import {React,useState}from 'react'
import axios from "axios";
import './AdminAreaAlerts.css'


function AdminAreaAlert(){
    const [formData,setFormData]=useState({
        area:"",
        problem:"",
        description:"",
        severity:"High",
        latitude:"",
        longitude:"",
        expiresAt:"",
    });
    const [loading,setLoading]=useState(false);
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value,
        })
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            setLoading(true);
            const response=await axios.post(" https://local-fix-india-backend.vercel.app/api/area-alerts",{
                ...formData,
                latitude:Number(formData.latitude),
                longitude:Number(formData.longitude),
            });
            console.log("Area Alert:",response.data);
            alert("area alert created successfully🚨");
            setFormData({
                 area:"",
        problem:"",
        description:"",
        severity:"High",
        latitude:"",
        longitude:"",
        expiresAt:"",
            })
        } catch(error){
            console.error(error);
        
        alert(
            error.response?.data?.message || "failed to create area alert"
        )
    }finally{
        setLoading(false);
    }
};

  return (
    <div className='area-alert-page'>
        <div className='area-alert-container'>
            <div className='alert-header'>
                <h1>Create Area Alert</h1>
                <p>Create an alert for users in an affected area.</p>

            </div>
 <form onSubmit={handleSubmit} className='area-alert-form'>
    {/* area */}
    <div className='form-group'>
        <label>Area</label>
        <input type="text" name="area" value={formData.area} onChange={handleChange} placeholder='sector 15 main road' required />
    </div>

{/* problem */}
<div className='form-group'>
    <label>Problem</label>
    <input type="text" name="problem" value={formData.problem} onChange={handleChange} placeholder='svere waterlogging' required />

</div>

{/* Description */}
<div className='form-group'>
    <label>Description</label>
    <textarea name="description" value={formData.description} onChange={handleChange} placeholder='avoid this route' rows="4"/>
</div>


<div className='form-group'>
    <label>Severity</label>
    <select name="severity" value={formData.severity} onChange={handleChange}>
        <option value="high">High</option>
        <option value="critical">Critical</option>

    </select>
    </div>

{/* location */}

<div className='location-row'>
    <div className='form-group'>
        <label>Latitude</label>
        <input type="number" step="any" name='latitude' value={formData.latitude} onChange={handleChange} placeholder='45.788' required />
    </div>
     <div className='form-group'>
        <label>Longitude</label>
        <input type="number" step="any" name='longitude' value={formData.longitude} onChange={handleChange} placeholder='89.788' required />
    </div>
</div>

{/* expiry */}
<div className='form-group'>
    <label>Alert Expiry</label>
    <input type="datetime-local" name='expireAt' value={formData.expireAt} onChange={handleChange} />
    <button type='submit' className='create-alert-btn' disable={loading}>{loading?"creating alert...":"🚨create Area alert"}</button>
</div>


 </form>
        </div>
      
    </div>
  );

}
export default AdminAreaAlert
