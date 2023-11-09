import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';
import { isExpired, decodeToken } from "react-jwt";

const LOGIN_URL = '/api/security/login';

const ROLES = {
    'User': 2001,
    'Editor': 1984,
    'Admin': 5150
}

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const roles = [];

    const userRef = useRef();
    const errRef = useRef();

    const { setAuth } = useAuth();
    const [userName, setUser] = useState('admin');
    const [password, setPwd] = useState('123');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [userName, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.defaults.baseURL = 'http://localhost:5276';
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ userName, password }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Methods': '*',
                        'Access-Control-Allow-Origin': '*'
                    },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data;
            localStorage.setItem('token', accessToken);
            const accessTokenDecode = decodeToken(accessToken);
            let currentRole = accessTokenDecode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            console.log(currentRole);
            roles.push(currentRole);
            setAuth({ userName, roles, accessToken });
            setUser('');
            setPwd('');
            navigate('/linkpage', { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    placeholder='admin'
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={userName}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder='123'
                    onChange={(e) => setPwd(e.target.value)}
                    value={password}
                    required
                />
                <button>Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    )
}

export default Login
