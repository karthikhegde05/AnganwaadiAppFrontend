import { RouteComponentProps, useLocation } from "react-router";
import { IonRouterOutlet, IonRouterLink, IonPage, IonContent} from "@ionic/react";
import useAuth from "../hooks/useAuth";
import React from "react";


// const RequireAuth:React.FC<RouteComponentProps> = ({history}:any) =>{
//     const authContext = useAuth();
//     const location = useLocation();

//     if (authContext?.auth?.loggedIn){
//         <IonRouterOutlet>
//         </IonRouterOutlet>
//     }
// };

const RequireAuth:React.FC = () =>{
    return (
        <IonPage>
            <IonContent>
                <p>Hello</p>
            </IonContent>
        </IonPage>
    );
}

export default RequireAuth;