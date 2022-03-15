import React from "react";

export const Login = ({setLogged}) =>{
    return(<>
        LOGIN
        <button onClick={(e) => setLogged(true)}>Authentication</button>
    </>)
}