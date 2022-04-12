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
    const [growthStatus, setGrowthStatus] = useState("");
    const [otherSymptoms, setOthSymptoms] = useState();

    const [buttonCheck, setButtonCheck] = useState(false);

    const gender:String = hist.state.gender;

    
    const authContext = useAuth();
    const logout = async() => {
      if(authContext!=null){
          authContext.setAuth({awwId:"", loggedIn:false});
        }
    }

    const changeButtonText = () => {
      console.log("Hello");
      if(buttonCheck){
        return "Submit";
      }
      else{
        return "Confirm";
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
        var destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
        let ratio = weight;//height;

        console.log(weight);
        //if(gender == "M"){
        if(ratio < boysGrowthMap[height]){
          setGrowthStatus("SAM child");
          //alert("SAM child");
            //destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
        }
        else{
          setGrowthStatus("Healthy");
          //alert("Healthy");
            //destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
        }

        setButtonCheck(true);
        changeButtonText();

        //setButtonText("Confirm");
        //}

        /*if(gender == "F"){
          if(ratio < girlsGrowthMap[height]){
            alert("SAM child");
            //destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
          }
          else{
            alert("Healthy");
            //destUrl = "http://localhost:8081/followupFormSubmission/" + hist.state.followupId.toString();
          }
        }*/

        console.log(gender);
        console.log(destUrl);        
        
        if(buttonCheck){
            const submitResult = await Axios.post(destUrl,{
              "height": height,
              "weight": weight,
              "muac": muac,
              "growthStatus": growthStatus,
              "otherSymptoms": otherSymptoms
            }).then((response)=>{console.log("posted"); return formSubmissionSuccess(response);})
              .catch((err)=>{console.log(err);})
        }
    };

    const changeHeight = (e:any) =>{
      setHeight(e.target.value);
      setButtonCheck(false);
    }

    const changeWeight = (e:any) =>{
      setWeight(e.target.value);
      setButtonCheck(false);
    }

    const changeMuac = (e:any) =>{
      setMuac(e.target.value);
      setButtonCheck(false);
    }

    const changeSymptoms = (e:any) => {
      setOthSymptoms(e.target.value);
      setButtonCheck(false);
    }


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
                  <IonInput className="credential" placeholder="Height?" onIonChange={changeHeight} clearInput={true}/>
                  <IonInput className="credential" placeholder="Weight?" onIonChange={changeWeight} clearInput={true} />
                  <IonInput className="credential" placeholder="MUAC?" onIonChange={changeMuac} clearInput={true} />
                  {/*<IonInput className="credential" placeholder="Growth Status?" disabled= {true} clearInput={true} /> {/* make it radio buttons */}
                  <IonRow className = "credential"> {growthStatus}</IonRow>
                  <IonInput className="credential" placeholder="Any Other Symptoms?" onIonChange={changeSymptoms} clearInput={true} />
                  <IonRow className="ion-justify-content-center">
                    <IonButton onClick={formSubmission}> {changeButtonText()}</IonButton>
                  </IonRow>
              </IonCardContent>
            </IonCard>
          </IonContent>    
        </IonPage>
      );

};

export default FollowupFormComponent;