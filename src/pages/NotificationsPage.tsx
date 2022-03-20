import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, {useState} from "react";

const NotificationsPage: React.FC = () =>{
    return (
    <IonPage>
        <IonHeader>
        <IonToolbar>
            <IonTitle>Notifications Page</IonTitle>
        </IonToolbar>
        </IonHeader>

        <IonContent>
            <h4>Show Notifications related to followup here!</h4>
        </IonContent>

    </IonPage>
    );
};

export default NotificationsPage;