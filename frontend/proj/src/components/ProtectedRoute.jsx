import React from 'react'
import {Navigate} from "react-router-dom"
const ProtectedRoute = ({children}) => {
    const ISAdminLoggedIn=localStorage.getItem("adminLoggedIn")==="true";
    if(!ISAdminLoggedIn){
        return<Navigate to ="/admin-login" replace/>;
    }
  return children;
};

export default ProtectedRoute
