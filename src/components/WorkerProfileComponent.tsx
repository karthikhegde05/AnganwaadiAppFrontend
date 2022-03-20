import {IonButton, IonContent, useIonRouter} from '@ionic/react';
import React, {useState} from 'react';
import { Router } from 'workbox-routing';


const WorkerProfileComponent: React.FC = () => {

    const router = useIonRouter();
    var pressed:boolean = false;
    
    const redirectToProfile = () => {
        router.push("/workerProfile");
    };

    return (
        <IonButton disabled={pressed} onClick={redirectToProfile}>Your-profile</IonButton>
    );
};

export default WorkerProfileComponent;