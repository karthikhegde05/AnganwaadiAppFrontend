import { IonButton, IonContent, useIonRouter } from "@ionic/react";
import React, {useState} from "react";
import { useHistory } from "react-router";

type FollowupProps = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number
}


const TakeFollowupComponent: React.FC<FollowupProps> = (props: FollowupProps) =>{

    const history = useHistory<FollowupProps>();

    const redirectToFollowupForm = () => {
        history.push({
            pathname: "/followupForm",
            state: props
        });
    }

    if(props.hasCompleted==true){
        return (
            <IonButton disabled={true}>Followup-Date:{props.completedDate}</IonButton>
        );
    }

    return (
        <IonButton onClick={redirectToFollowupForm}>Followup-deadline:{props.deadlineDate}</IonButton>
    );
};

export default TakeFollowupComponent;