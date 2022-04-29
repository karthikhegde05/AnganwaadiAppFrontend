import { IonPage, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react"
import { arrowBack, checkmarkCircle } from "ionicons/icons"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import LocalDB from "../storage/LocalDB"

type FollowUpDTO = {
    followupId: number,
    workerId: number,
    deadline_date: string,
    completed_date: string,
    completed: boolean,
    samId: number,
    healthStatus: healthStatusDTO
    createdDate: string
}

type healthStatusDTO = {

    hsId:number,
    height:number,
    weight:number,
    muac:number,
    growthStatus: string,
    otherSymptoms: string,

}




const FollowUpDisplayComponent: React.FC = () =>{

   
    const [followup, setFollowUp] = useState<FollowUpDTO>();

    const hist = useLocation<FollowUpDTO>();

    if(followup === undefined)
      setFollowUp(hist.state);

    console.log(followup);


    return(
        <IonPage>
          <IonHeader>
            <IonToolbar>

              <IonButtons slot="start">
                <IonButton>
                  <IonIcon icon={arrowBack}/>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
  
          <IonContent fullscreen>
           
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Follow Up Details</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    <IonList>
                        <IonItem>Completed Date: {followup?.completed_date}</IonItem>
                        <IonItem>Completed Date: {followup?.completed_date}</IonItem>
                        <IonItem>Height: {followup?.healthStatus.height}</IonItem>
                        <IonItem>Weight: {followup?.healthStatus.weight}</IonItem>
                        <IonItem>MUAC: {followup?.healthStatus.muac}</IonItem>
                        <IonItem>Growth Status: {followup?.healthStatus.growthStatus}</IonItem>
                        <IonItem>Other Symptoms: {followup?.healthStatus.otherSymptoms}</IonItem>
                        <IonItem>Deadline Date: {followup?.deadline_date}</IonItem>
                    </IonList>
                       

                    
                </IonCardContent>
            </IonCard>
          </IonContent>    
        </IonPage>
    )
}

export default FollowUpDisplayComponent;