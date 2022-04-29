import { IonButton, IonItem, IonLabel } from "@ionic/react";

type FollowUp = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number
}

const FollowUpListItem: React.FC<FollowUp> = (props: FollowUp) =>{

    return (
        <IonItem>
            <IonLabel>
                <h2>{props.deadlineDate}</h2>
            </IonLabel>
        </IonItem>
    );
};

export default FollowUpListItem;