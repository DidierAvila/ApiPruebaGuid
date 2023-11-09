import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const Users = () => {
    const [users, setUsers] = useState();
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const access_token = localStorage.getItem('token');

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                axiosPrivate.defaults.baseURL = 'http://localhost:5276';
                const response = await axiosPrivate.get('/api/User',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Methods': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${access_token}`
                        },
                        signal: controller.signal
                    });
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <div className='row'>
            <h2>Users List</h2>
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell align="right">Nombre</TableCell>
                            <TableCell align="right">Apellido</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Rol</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.map((row, i) => (
                            <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right">{row?.id}</TableCell>
                                <TableCell align="right">{row?.firstName}</TableCell>
                                <TableCell align="right">{row?.lastName}</TableCell>
                                <TableCell align="right">{row?.email}</TableCell>
                                <TableCell align="right">{row?.role}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Users;
