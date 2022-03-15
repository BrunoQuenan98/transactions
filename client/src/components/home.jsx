import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = ({setLogged}) =>{
    const navigate = useNavigate();
    const [allTransactions, setAllTransactions] = useState(null)

    useEffect(() =>{
        const getTransactions = async ()=>{
            try{
            const token = localStorage.getItem('token');
            const transactions = await axios.get('http://localhost:3001/transactions', {
                headers: { token }
            })
            setAllTransactions(transactions.data);
            }catch(e){
                console.log(e.message);
            }
        }
        getTransactions();
    },[])

    const handleLogout = (e) =>{
        setLogged(false);
        localStorage.clear();
        navigate('/');
    }

    return(<>
         <h1>HOME</h1>
         <button onClick={(e) => handleLogout(e)}>Logout</button>
    </>)
}