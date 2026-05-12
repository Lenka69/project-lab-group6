import React, {useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../utils/api.js";


const Register = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const register = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());

        try{
            const res = await axios.post(API_URL + '/register', data)
            alert(res.data.message);
            navigate('/');
        } catch (e){
            window.alert(e.response.data.error)
        }
    }

    return (
        <div className={'form-wrapper'}>
            <form action="" onSubmit={register}>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" onChange={(e) => setName(e.target.value)} id="name" name={"name"}/>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name={"email"}/>
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name={"password"}/>
                </div>

                <button>Register</button>
            </form>

        </div>
    );
};

export default Register;