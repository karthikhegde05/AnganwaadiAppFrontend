import { IonButton, IonContent, useIonRouter } from "@ionic/react";
import React, {ReactPropTypes, useState} from "react";
import { RouteComponentProps, useHistory } from "react-router";

type FollowupProps = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number
}

type historyTypeProps = {
    patientId: Number
}

const PatientComponent: React.FC<FollowupProps> = (props: FollowupProps) =>{


    const history = useHistory<historyTypeProps>();
    var pressed:boolean = false;


    const redirectToPatientProfile = () =>{
        history.push({
            pathname:"/patientProfile",
            state: {patientId: props.patientId}
        })
    };

    return (
        <IonButton disabled={pressed} onClick={redirectToPatientProfile}>Id:{props.followupId}, Date:{props.deadlineDate}</IonButton>
    );
};

export default PatientComponent;