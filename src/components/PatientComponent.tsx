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

    //let today = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
    //const today = new Date().toISOString();
    const today = new Date('2022-05-25').toISOString();
    const color = (props.deadlineDate.localeCompare(today) <= 0)? "danger": "primary";

    return (
        <IonButton disabled={pressed} onClick={redirectToPatientProfile} color = {color}>Id:{props.followupId}, Date:{props.deadlineDate}, Patient:{props.patientId}</IonButton>
    );
};

export default PatientComponent;