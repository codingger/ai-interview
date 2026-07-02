import React from "react";
import "./sidebar.css";
import {Link} from "react-router";
function Sidebar(){
    return(
        <div className="block">
            
            <p><Link to="job-application">job applications</Link></p>
            <p><Link to="ai-interview">ai interviewer</Link></p>
            <p>resume generator</p>
        </div>
    )
}
export default Sidebar;