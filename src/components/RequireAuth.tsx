import { RouteComponentProps, useLocation } from "react-router";
import { IonRouterOutlet, IonRouterLink} from "@ionic/react";
import useAuth from "../hooks/useAuth";
import React from "react";


const RequireAuth = () =>{
    const {auth, setAuth} = useAuth();
    const location = useLocation();


    return {

    }
};

export default RequireAuth;