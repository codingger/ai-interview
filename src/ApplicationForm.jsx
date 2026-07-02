import React,{useState} from "react";
import "./ApplicationForm.css";
import { useOutletContext } from "react-router";
function Application(){
    const handleSubmit=useOutletContext();
    const[userinfo,SetUserInfo]=useState({
        company_name:"",
        job_title:"",
        job_description:"",
        status:"",
        applied_date:"",

    })
    function handleChange(event){
       const{name,value}=event.target;
       SetUserInfo(prevValue=>{
        return{
            ...prevValue,
            [name]:value
        }
       });
    }

    function passData(){
        event.preventDefault();
        handleSubmit(userinfo);
    }

    return(
        <form onSubmit={passData}className="form">
            <label htmlFor="name">Company Name:</label>
            <input id="name" value={userinfo.company_name} onChange={handleChange} name="company_name" type="text"/>
            <label htmlFor="job-title">Job title:</label>
            <input id="job-title" value={userinfo.job_title} onChange={handleChange} name="job_title" type="text"/>
            <label htmlFor="job-description">Job description:</label>
            <input id="job-description" value={userinfo.job_description} onChange={handleChange} name="job_description" type="text"/>
            <label htmlFor="status">Status:</label>
            <select id="status" value={userinfo.status} onChange={handleChange} name="status" defaultValue="">
                <option value="" disabled>Select status</option>
                <option value="applied">Applied</option>
                <option value="not applied">Not applied</option>
                <option value="waiting">Waiting</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
            </select>
            <label htmlFor="date">Date:</label>
            <input id="date" value={userinfo.applied_date} onChange={handleChange} name="applied_date" type="date" placeholder="Application_date"/>
            <button type="submit">Submit</button>
        </form>
    )
}
export default Application;