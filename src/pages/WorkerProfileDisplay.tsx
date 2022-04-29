import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonItem, IonList, IonPage, IonToolbar } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import LocalDB from "../storage/LocalDB";

type WorkerProfile = {
    aww_id:number,
    name:string,
    contact_number:string,
    username:string,
    email:string,
    aw_address:string,
    aw_location:string
}

const WorkerProfileDisplayComponent: React.FC = () =>{

    const history = useHistory();
    const [profile, setProfile] = useState<WorkerProfile>();

    const getWorkerDetails = async () => {
        LocalDB.open();
        const profile = await LocalDB.getWorkerDetails();
        setProfile(profile);
    }

    useEffect(() =>{
        getWorkerDetails();
    }, []);

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot= "start">
                        <IonButton onClick={history.goBack}>
                            <IonIcon icon={arrowBack}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Your Profile</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <IonItem>Name:{profile?.name}</IonItem>
                            <IonItem>Contact Number:{profile?.contact_number}</IonItem>
                            <IonItem>UserName:{profile?.username}</IonItem>
                            <IonItem>Email:{profile?.email}</IonItem>
                            <IonItem>Anganwadi Location:{profile?.aw_location}</IonItem>
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default WorkerProfileDisplayComponent;