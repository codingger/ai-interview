import React, { useState } from "react";
import "./Login.css";
import Button from '@mui/material/Button';
function Login(props) {
    const [UserInfo, SetUserInfo] = useState({
        name: "",
        email: "",
        password: "",
    });
    function handleChange(event) {
        const { name, value } = event.target;
        SetUserInfo(prevValue => {
            return {
                ...prevValue,
                [name]: value
            }
        });
    }

    return (
        <div className="content">
            <div className="para">
                <h1>The Job TRacker.</h1>
                <p>Organise your job hunt with grace.</p>
            </div>
            <form className="Login_Section">
                <label htmlFor="name-input">Name:</label>
                <input type="text" id="name-input" name="name" onChange={handleChange} value={UserInfo.name} placeholder="enter your name" />
                <label htmlFor="email-input">Email:</label>
                <input type="email" id="email-input" name="email" onChange={handleChange} value={UserInfo.email} placeholder="enter your email" />
                <label htmlFor="password-input">Password:</label>
                <input type="password" id="password-input" name="password" onChange={handleChange} value={UserInfo.password} placeholder="enter your password" />
                <div className="buttons">
                    <div className="buttons">
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            type="button"
                            onClick={() => props.onRegister(UserInfo)}
                        >
                            Register
                        </Button>

                        <Button
                            size="small"
                            variant="contained"
                            type="button"
                            onClick={() => props.onLogin(UserInfo)}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </form>
        </div>

    )
}
export default Login;