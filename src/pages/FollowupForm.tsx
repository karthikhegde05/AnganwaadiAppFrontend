import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import React, {useState} from "react";
import { useHistory, useLocation } from "react-router";
import { boysGrowthMap , girlsGrowthMap} from "../components/GrowthMap";
import Axios, {AxiosResponse} from 'axios';
import { arrowBack } from "ionicons/icons";
import useAuth from "../hooks/useAuth";

type FollowupProps = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number,
    gender: String
}

type patientProfileProps = {
    patientId: Number
}


const FollowupFormComponent: React.FC = () =>{
    const hist = useLocation<FollowupProps>();

    const history = useHistory<patientProfileProps>();

    const [height, setHeight] = useState(1);
    const [weight, setWeight] = useState(0);
    const [muac, setMuac] = useState();
    const [growthStatus, setGrowthStatus] = useState();
    const [otherSymptoms, setOthSymptoms] = useState();

    const gender:String = hist.state.gender;

    
    const authContext = useAuth();
    const logout = async() => {
      if(authContext!=null){
          authContext.setAuth({awwId:"", loggedIn:false});
        }
    }

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
        var destUrl = "";
        let ratio = weight;//height;

        console.log(weight);
        if(gender == "M"){
          if(ratio < boysGrowthMap[height]){
            alert("SAM child");
            destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
          }
          else{
            alert("Healthy");
            destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
          }
        }

        if(gender == "F"){
          if(ratio < girlsGrowthMap[height]){
            alert("SAM child");
            destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
          }
          else{
            alert("Healthy");
            destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
          }
        }

        console.log(gender);
        console.log(destUrl);
        

        const submitResult = await Axios.post(destUrl,{
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
              <IonRow>           
              <IonCol> <IonTitle>Follow up form for patientId: {hist.state.patientId}</IonTitle> </IonCol>
              <IonCol /><IonCol />
              <IonCol /><IonButton onClick = {logout}>Logout <IonIcon slot="start" icon={arrowBack} /> </IonButton>             
              </IonRow>          
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