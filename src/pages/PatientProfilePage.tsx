import {IonButton, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar} from '@ionic/react';
import Axios, { AxiosResponse } from 'axios';
import { arrowBack } from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TakeFollowupComponent from '../components/TakeFollowupComponent';
import useAuth from '../hooks/useAuth';
import LocalDB from '../storage/LocalDB';

type historyTypeProps = {
    patientId: Number
}

type dischargeType = {
    dischargeId: Number,
    admissionDate: String,
    dischargeDate: String,
    admissionWt: Number,
    targetWt: Number,
    outcome: String
}

const PatientProfilePage: React.FC = () => {

    const hist = useLocation<historyTypeProps>();
    const patientId = hist.state.patientId;
    console.log(patientId);

    const [countSummary, setCountSummary] = useState<Number>(0);
    const [latDisSummary, setLatDisSummary] = useState<dischargeType>({dischargeId:0, admissionDate:"unknown", dischargeDate:"unknown", 
                                                admissionWt:0, targetWt:0, outcome:"unknown"});
    const [lstFollowups, setLstFollowups] = useState([]);

    const authContext = useAuth();
    const logout = async() => {
      if(authContext!=null){
          authContext.setAuth({awwId:"", loggedIn:false});
        }
    }


    const GetPatientDetailsSuccess = (response:AxiosResponse) => {
        if(response.data.nullObj==false){
            setCountSummary(response.data.countDischarges);
            setLatDisSummary(response.data.latestDischargeSummary);
            setLstFollowups(response.data.lstFollowups);
        }
      };
    
      const GetPatientDetails = async() => {
          const result = await Axios.get("http://localhost:8081/patientProfile/" + patientId.toString())
                      .then((response)=>{console.log("fetched"); return GetPatientDetailsSuccess(response);})
                      .catch((err)=>{console.log(err); return "error";});
      };
    
      useEffect(() => {
          GetPatientDetails();
      }, []); 
    

    return (
        <IonPage>
            <IonHeader>
            <IonToolbar>
                <IonRow>
                    <IonCol><IonTitle>Patient Profile Page Id: {patientId}</IonTitle></IonCol>
                    <IonCol /> <IonCol />
                    <IonCol/><IonButton onClick = {logout}>Logout <IonIcon slot="start" icon={arrowBack} /> </IonButton>
                    
                </IonRow>
                
            </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonCard>
                    <IonCardContent>
                        <IonRow  className="ion-justify-content-center">
                            {/* <h4>Discharge Summary : button/ text</h4> */}

                            <div>
                                <h3>Latest Discharge Summary</h3>
                                <p>count of discharges - {countSummary}</p>
                                <p>Discharge id: {latDisSummary.dischargeId}</p>
                                <p>Admission Date: {latDisSummary.admissionDate}</p>
                                <p>Discharge Date: {latDisSummary.dischargeDate}</p>
                                <p>Admission weight: {latDisSummary.admissionDate}</p>
                                <p>Target weight: {latDisSummary.targetWt}</p>
                                <p>Outcome of treatment at NRC: {latDisSummary.outcome}</p>
                            </div>
                        </IonRow>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        {
                            lstFollowups.map((followup, index) => {
                                return (
                                <IonRow  className="ion-justify-content-center">
                                    <TakeFollowupComponent key={index} {...followup}/>
                                </IonRow>
                                );
                            })
                        }
                          
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <IonRow  className="ion-justify-content-center">
                            <h4>Growth Statistics: button/image</h4>
                        </IonRow>                    
                    </IonCardContent>
                </IonCard>
            </IonContent>


        </IonPage>
    );
};

export default PatientProfilePage;