import { IonButton, IonModal, IonButtons,IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar, useIonAlert, useIonRouter, useIonModal } from "@ionic/react";
import React, {useState} from "react";
import { useHistory, useLocation } from "react-router";
import { boysGrowthMap , girlsGrowthMap} from "../components/GrowthMap";
import Axios, {AxiosResponse} from 'axios';
import { arrowBack, checkmarkCircle, alertCircleOutline } from "ionicons/icons";
import useAuth from "../hooks/useAuth";
import './FollowupForm.css';
import LocalDB from '../storage/LocalDB';


type FollowupProps = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number,
    gender: String
}

type FollowupFormData = {
  samId: number,
  deadlineDate:string,
  gender: string,
  followupId: number
}

type patientProfileProps = {
    patientId: Number
}

const FollowupFormComponent: React.FC = () =>{
    const hist = useLocation<FollowupFormData>();

    const history = useHistory<patientProfileProps>();

    const [height, setHeight] = useState(0);
    const [weight, setWeight] = useState(0);
    const [muac, setMuac] = useState(0);
    const [growthStatus, setGrowthStatus] = useState("");
    const [otherSymptoms, setOthSymptoms] = useState("");
    const [gender, setGender] = useState<string>();

    const [presentSAMalert, dismiss] = useIonModal(SAMAlert);

    const [presentRegularAlert, dismissa] = useIonModal(RegularAlert);

    const [alerter] = useIonAlert();

    if(gender === undefined){
      setGender(hist.state.gender);
    }

    
    const authContext = useAuth();
    const logout = async() => {
      if(authContext!=null){
          authContext.setAuth({awwId:"", loggedIn:false});
        }
    }

    const formSubmission = async() => {


      var gs = ""
      let gender = hist.state.gender;
      // console.log(gender)
        if(gender == "M"){
          // console.log("entered")
          if(weight <= boysGrowthMap[height]){
            gs = "SAM";
            // console.log("entered1")
          }
          else{
            // console.log("entered2")
            gs = "regular";
          }
        }
        else if(gender == "F"){
          console.log(weight);
          console.log(girlsGrowthMap[height]);
          if(weight <= girlsGrowthMap[height]){
            gs = "SAM";
          }
          else{
            gs = "regular";
          }
        }
        LocalDB.fillFollowup(hist.state.followupId, height, weight, muac, gs, otherSymptoms);

        if(gs == "regular"){
          presentRegularAlert();
          // console.log(height, weight, muac, otherSymptoms, hist.state.gender);
          setTimeout(() => {
            
            dismissa();
            history.go(-1);
            // history.replace("/home");
            
          }, 5000);
          
        }
        else {
          presentSAMalert();
          // console.log(height, weight, muac, otherSymptoms, hist.state.gender);
          setTimeout(() => {
            
            dismiss();
            history.go(-1);
            // history.replace("/home");
            
          }, 5000);
          
        }
        

    
    };

    return (
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
           
            <IonList>
              <IonItem>
                <IonLabel position="floating">Height (cm)</IonLabel>
                <IonInput type="number" onIonChange={(e: any) => setHeight(e.target.value)}/>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Weight (kg)</IonLabel>
                <IonInput type="number" onIonChange={(e: any) => setWeight(e.target.value)}/>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">MUAC (cm)</IonLabel>
                <IonInput type="number" onIonChange={(e: any) => setMuac(e.target.value)}/>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Other Symptoms</IonLabel>
                <IonInput type="text" onIonChange={(e: any) => setOthSymptoms(e.target.value)}/>
              </IonItem>
            </IonList>
            <IonButton expand="block" onClick={formSubmission} id="submit"><IonIcon icon={checkmarkCircle} slot="start"/>Submit</IonButton>
          </IonContent>    
        </IonPage>
      );

};

const SAMAlert: React.FC = () => {

  return(
    <IonContent color="danger">
      <p className="splash"><IonIcon icon={alertCircleOutline} class="splash"/></p> 
      <h1 className="splash">The child is below SAM threshold</h1>  
    </IonContent>
  );

}

const RegularAlert: React.FC = () => {

  return(
    <IonContent color="success">
      <p className="splash"><IonIcon icon={checkmarkCircle} class="splash"/></p> 
      <h1 className="splash">Follow Up recorded</h1>  
    </IonContent>
  );

}
  
  



export default FollowupFormComponent;