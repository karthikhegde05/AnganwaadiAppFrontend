import { IonButton, IonContent, useIonRouter } from "@ionic/react";
import React, {useState} from "react";

const PatientComponent: React.FC = () =>{


    const router = useIonRouter();
    var pressed:boolean = false;

    const redirectToPatientProfile = () => {
        router.push("/patientProfile");
    };

    return (
        <IonButton disabled={pressed} onClick={redirectToPatientProfile}>Patient - 1</IonButton>
    );
};

export default PatientComponent;