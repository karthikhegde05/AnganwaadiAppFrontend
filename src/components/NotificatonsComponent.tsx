import { IonButton, IonContent, useIonRouter } from "@ionic/react";
import React, {useState} from "react";

const NotificationsComponent: React.FC = () =>{


    const router = useIonRouter();
    var pressed:boolean = false;

    const redirectToNotifications = () => {
        router.push("/notifications");
    };

    return (
        <IonButton disabled={pressed} onClick={redirectToNotifications}>Notifications</IonButton>
    );
};

export default NotificationsComponent;