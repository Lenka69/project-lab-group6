import React, {useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../utils/api.js";

const Register = () => {
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        try{
            const res = await axios.post(API_URL + '/login', data)
            alert('Login telah berhasil');
            navigate('/');
            localStorage.setItem('token', res.data.token);
        } catch (e){
            window.alert(e.response.data.error)
        }
    }

    return (
        <div className={'form-wrapper'}>
            <form action="" onSubmit={login}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name={"email"}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name={"password"}/>
                </div>

                <button>Login</button>
            </form>

        </div>
    );
};

export default Register;