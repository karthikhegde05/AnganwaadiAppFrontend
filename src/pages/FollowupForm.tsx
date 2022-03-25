import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import React, {useState} from "react";
import { useHistory, useLocation } from "react-router";
import Axios, {AxiosResponse} from 'axios';

type FollowupProps = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number
}

type patientProfileProps = {
    patientId: Number
}


const FollowupFormComponent: React.FC = () =>{
    const hist = useLocation<FollowupProps>();

    const history = useHistory<patientProfileProps>();

    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();
    const [muac, setMuac] = useState();
    const [growthStatus, setGrowthStatus] = useState();
    const [otherSymptoms, setOthSymptoms] = useState();

    const formSubmissionSuccess = (response:AxiosResponse) => {

        
        if(response.data.result==true){
            history.push({
                pathname: "/patientProfile",
                state: {patientId: hist.state.patientId}
            });
        }
        else {
            return "invalid";
        }
    };

    const formSubmission = async() => {
        const submitResult = await Axios.post("http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString() ,{
            "height": height,
            "weight": weight,
            "muac": muac,
            "growthStatus": growthStatus,
            "otherSymptoms": otherSymptoms
        }).then((response)=>{console.log("posted"); return formSubmissionSuccess(response);})
        .catch((err)=>{console.log(err);})
    };

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Follow up form for patientId: {hist.state.patientId}</IonTitle>
            </IonToolbar>
          </IonHeader>
  
          <IonContent>
            <IonCard color="warning">
              <IonCardContent className="ion-padding">
                  <IonInput className="credential" placeholder="Height?" onIonChange={(e: any) => setHeight(e.target.value)} clearInput={true} />
                  <IonInput className="credential" placeholder="Weight?" onIonChange={(e: any) => setWeight(e.target.value)} clearInput={true} />
                  <IonInput className="credential" placeholder="MUAC?" onIonChange={(e: any) => setMuac(e.target.value)} clearInput={true} />
                  <IonInput className="credential" placeholder="Growth Status?" onIonChange={(e: any) => setGrowthStatus(e.target.value)} clearInput={true} /> {/* make it radio buttons */}
                  <IonInput className="credential" placeholder="Any Other Symptoms?" onIonChange={(e: any) => setOthSymptoms(e.target.value)} clearInput={true} />
                  <IonRow className="ion-justify-content-center">
                    <IonButton onClick={formSubmission}>Submit</IonButton>
                  </IonRow>
              </IonCardContent>
            </IonCard>
          </IonContent>    
        </IonPage>
      );

};

export default FollowupFormComponent;