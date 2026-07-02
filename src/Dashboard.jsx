import React from "react";
import Sidebar from "./sidebar";
import "./Dashboard.css";
import {Outlet} from "react-router";
import axios from "axios";
function Dashboard() {
    const URL="http://localhost:3000/jobs";
    async function handleSubmit(data){
        try {
            const result=await axios.post(`${URL}`,data);
            alert("form added successfully.");
        } catch (error) {
            console.log(error);
            alert("insertion failed try agian later.");
        }
    }
    return (
        <div className="items">
            <Sidebar />  
            <div className="main-content">
                <Outlet context={handleSubmit} /> 
            </div>
        </div>
    )
}
export default Dashboard;