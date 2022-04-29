import {IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonTab, IonTabs, IonTitle, IonToolbar} from '@ionic/react';
import Axios, { AxiosResponse } from 'axios';
import { arrowBack, caretForward, pencil, search } from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import TakeFollowupComponent from '../components/TakeFollowupComponent';
import useAuth from '../hooks/useAuth';
import LocalDB from '../storage/LocalDB';

type historyTypeProps = {
    patientId: Number
}

type healthStatusDTO = {

    hsId:number,
    height:number,
    weight:number,
    muac:number,
    growthStatus: string,
    otherSymptoms: string,

}

type FollowupDTO = {
    followupId: number,
    workerId: number,
    deadline_date: string,
    completed_date: string,
    completed: boolean,
    samId: number,
    healthStatus: healthStatusDTO
    createdDate: string
}

type FollowupFormData = {
    samId: number,
    deadlineDate:string,
    gender: string,
    followupId: number
}

type patientDTO = {
    samId: number,
    uhId: string,
    rchId: string,
    name: string,
    age: number,
    dob: string,
    gender: string,
    address: string,
    city: string,
    contactNumber: string,
    relationshipStatus: string,
    caste: string,
    religion: string,
    bpl: string,
    referredBy: string,
    last_updated: string,
    followups: FollowupDTO[]
}

type dischargeType = {
    dischargeId: Number,
    admissionDate: String,
    dischargeDate: String,
    admissionWt: Number,
    targetWt: Number,
    outcome: String
}

type Discharge = {
    dischargeId:number,
    admissionDate:string,
    admissionWeight:number,
    targetWeight:number,
    dischargeDate:string,
    dischargeWeight:number,
    outcome:string,
    treatmentProtocol:string
    samId:number
}


const PatientProfilePage: React.FC = () => {

    const [patientId, setPatientId] = useState<Number>();

    const hist = useLocation<historyTypeProps>();
    if(patientId === undefined){
        
        setPatientId(hist.state.patientId);
    }
    

    // const hist = useLocation<historyTypeProps>();
    // console.log("b");
    // const patientId = hist.state.patientId;
    // const patientId = 1;
    // console.log(hist);
    const location = useLocation();

    const history = useHistory();
    // console.log(history);

    const [dischargeSummary, setDischargeSummary] = useState<Discharge>();
    const [patientDetails, setPatientDetails] = useState<patientDTO>();
    const [upcomingFollowUps, setUpcomingFollowUps] = useState<FollowupDTO[]>([]);
    const [editableFollowUps, setEditableFollowUps] = useState<FollowupDTO[]>([]);
    const [completedFollowUps, setCompletedFollowUps] = useState<FollowupDTO[]>([]);


    const authContext = useAuth();
    const logout = async() => {
      if(authContext!=null){
          authContext.setAuth({awwId:"", loggedIn:false});
        }
    }

    
      const GetPatientDetails = async() => {
        //   const result = await Axios.get("http://localhost:8081/patientProfile/" + patientId.toString())
        //               .then((response)=>{console.log("fetched"); return GetPatientDetailsSuccess(response);})
        //               .catch((err)=>{console.log(err); return "error";});

        await LocalDB.open();
        var l = await LocalDB.getPatient(patientId!.valueOf());
        setPatientDetails(l);
        var d = await LocalDB.getLatestDischarge(patientId!.valueOf());
        setDischargeSummary(d);
        const lastSync = await LocalDB.getLastSync();

        var completed:FollowupDTO[] = [];
        var upcoming:FollowupDTO[] = [];
        var editable:FollowupDTO[] = [];
        l.followups.forEach((followup: FollowupDTO) => {
            
            if(followup.completed == true){
                if(lastSync.localeCompare(followup.completed_date) != -1)
                    completed.push(followup);
                else
                    editable.push(followup);
            }
            else{
                upcoming.push(followup);
            }

        });

        setCompletedFollowUps(completed);
        setUpcomingFollowUps(upcoming);
        setEditableFollowUps(editable);

      };

    //   GetPatientDetails();
    
      useEffect(() => {
          GetPatientDetails();
      }, [location]); 
    

    return (
        <IonPage>
            <IonHeader>
            <IonToolbar>
                {/* <IonRow>
                    <IonCol><IonTitle>Patient Profile Page Id: {patientId}</IonTitle></IonCol>
                    <IonCol /> <IonCol />
                    <IonCol/><IonButton onClick = {logout}>Logout <IonIcon slot="start" icon={arrowBack} /> </IonButton>
                    
                </IonRow> */}

                <IonButtons slot='start'>
                    <IonButton onClick={history.goBack}><IonIcon icon={arrowBack}></IonIcon></IonButton>
                </IonButtons>
                
            </IonToolbar>
            </IonHeader>
            
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Profile</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div>
                        
                            <p>SAM ID:{patientDetails?.samId}</p>
                            <p>Name:{patientDetails?.name}</p>
                            <p>Age:{patientDetails?.age}</p>
                            <p>Gender:{patientDetails?.gender}</p>
                            <p>Date of Birth:{patientDetails?.dob}</p>
                            <p>Address:{patientDetails?.address}</p>
                            <p>City:{patientDetails?.city}</p>
                            <p>Contact Number:{patientDetails?.contactNumber}</p>


                        </div>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Discharge Summary</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div>
                            <p>Discharge id: {dischargeSummary?.dischargeId}</p>
                            <p>Admission date: {dischargeSummary?.admissionDate}</p>
                            <p>Admission weight: {dischargeSummary?.admissionWeight}</p>
                            <p>Target weight: {dischargeSummary?.targetWeight}</p>
                            <p>Discharge date: {dischargeSummary?.dischargeDate}</p>
                            <p>Discharge weight: {dischargeSummary?.dischargeWeight}</p>
                            <p>Treatment protocol: {dischargeSummary?.treatmentProtocol}</p>
                            <p>Outcome of treatment at NRC: {dischargeSummary?.outcome}</p>
                        </div>
                
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Upcoming</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {
                            upcomingFollowUps.map((followup, index) => {

                                const f:FollowupFormData = {samId:patientDetails!.samId, gender:patientDetails!.gender, deadlineDate:followup.deadline_date, followupId: followup.followupId}
                                return (
                                    
                                    <FollowUpListItem key={index} {...f}/>
                                    
                                );
                            })
                        }
                          
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Editable</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {
                            editableFollowUps.map((followup, index) => {

                                const f:FollowupFormData = {samId:patientDetails!.samId, gender:patientDetails!.gender, deadlineDate:followup.deadline_date, followupId: followup.followupId}
                                return (
                                    
                                    <FollowUpListItem key={index} {...f}/>
                                    
                                );
                            })
                        }
                          
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Completed</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {
                            completedFollowUps.map((followup, index) => {

                                // const f:FollowupFormData = {samId:patientDetails!.samId, gender:patientDetails!.gender, deadlineDate:followup.deadline_date, followupId: followup.followupId}
                                return (
                                    
                                    <CompletedFollowUpListItem key={index} {...followup}/>
                                    
                                );
                            })
                        }
                          
                    </IonCardContent>
                </IonCard>

            </IonContent>


        </IonPage>
    );
};


const FollowUpListItem: React.FC<FollowupFormData> = (props:FollowupFormData) =>{

    const history = useHistory<FollowupFormData>();
    var pressed:boolean = false;
    const redirectToFollowupForm = () => {
        history.push({
            pathname: "/followupForm",
            state: props
        });
    }

    const today = new Date().toISOString().split("T")[0];
    const color = (props.deadlineDate.localeCompare(today) == -1)? "danger":(props.deadlineDate.localeCompare(today) == 0?"warning":"success");


    return(
        <IonItem color={color}>
            <IonLabel>
                <h2>{props.deadlineDate}</h2>
            </IonLabel>

            <IonButton disabled={pressed} onClick={redirectToFollowupForm} ><IonIcon icon={pencil}/></IonButton>
        </IonItem>
    );
}

const CompletedFollowUpListItem: React.FC<FollowupDTO> = (props:FollowupDTO) =>{

    const history = useHistory<FollowupDTO>();
    var pressed:boolean = false;
    const redirectToFollowupDisplay = () => {
        history.push({
            pathname: "/followupDisplay",
            state: props
        });
    }

    


    return(
        <IonItem color="success">
            <IonLabel>
                <h2>{props.completed_date}</h2>
            </IonLabel>

            <IonButton disabled={pressed} onClick={redirectToFollowupDisplay} ><IonIcon icon={search}/></IonButton>
        </IonItem>
    );
}

export default withRouter(PatientProfilePage);