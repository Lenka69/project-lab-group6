import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {API_URL} from "../utils/api.js";

const Me = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData =  async () => {
            setLoading(true)
            try {
                const token = localStorage.getItem('token');

                const res = await axios.get(`${API_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data);
            } catch (e){
                setError(e.response.data.error);
            } finally {
                setLoading(false);
            }

        }
        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>
    if (error) return <p style={{color: 'red'}}>{error}</p>

    return (
        <div className={'me-wrapper'}>
            <p>Hii, my name is {user.name}</p>
            <p>You can contact me through {user.email}</p>
        </div>
    );
};

export default Me;