import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";


const columns = [
    { id: 'id', label: 'Id', minWidth: 70 },
    { id: 'name', label: 'Nombre', minWidth: 100 },
    {
        id: 'code',
        label: 'Codigo',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'category',
        label: 'Categoria',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'stock',
        label: 'Stock',
        minWidth: 170,
        align: 'right'
    },
    {
        id: 'price',
        label: 'Precio',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [products, setProsucts] = useState();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const access_token = localStorage.getItem('token');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getProducts = async () => {
            try {
                axiosPrivate.defaults.baseURL = 'http://localhost:5276';
                const response = await axiosPrivate.get('/api/Product',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Methods': '*',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${access_token}`
                        },
                        withCredentials: true,
                        signal: controller.signal
                    });
                console.log(response.data);
                isMounted && setProsucts(response.data);
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getProducts();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])

    return (
        <div className='row'>
            <h1>Product Page</h1>
            <br />
            <Paper sx={{  width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products
                                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, i) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={(products)? products.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    )
}



export default Product