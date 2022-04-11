import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React, {useState} from "react";
import useAuth from "../hooks/useAuth";

const NotificationsPage: React.FC = () =>{

    const authContext = useAuth();
    const logout = async() => {
      if(authContext!=null){
          authContext.setAuth({awwId:"", loggedIn:false});
        }
    }

    return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
            <IonRow>
                <IonCol><IonTitle>Notifications Page</IonTitle> </IonCol>
                <IonCol/> <IonCol/>
                <IonCol/><IonButton onClick = {logout}>Logout <IonIcon slot="start" icon={arrowBack} /> </IonButton>

            </IonRow>
        </IonToolbar>
        </IonHeader>

        <IonContent>
            <h4>Show Notifications related to followup here!</h4>
        </IonContent>

    </IonPage>
    );
};

export default NotificationsPage;