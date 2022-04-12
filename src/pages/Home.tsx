import { IonButton, IonCard, IonCardContent, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonRow, IonSearchbar, IonTitle, IonToolbar, SearchbarChangeEventDetail } from '@ionic/react';
import { RouteComponentProps, useLocation, useParams } from 'react-router';
import HomeSearchBar from '../components/HomeSearchBar';
import NotificationsComponent from '../components/NotificatonsComponent';
import PatientComponent from '../components/PatientComponent';
import WorkerProfileComponent from '../components/WorkerProfileComponent';
import Login from './Login';
import './Home.css';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import PatientProfilePage from './PatientProfilePage';
import LocalDB from '../storage/LocalDB';
import { arrowBack } from 'ionicons/icons';
import { ListenOptions } from 'net';

type Followup = {
  followupId: Number,
  deadlineDate: String,
  completedDate: String,
  hasCompleted: boolean,
  patientId: Number
}

//import {giveSearchText} from '../components/HomeSearchBar';

const Home: React.FC = () => {

  const authContext = useAuth();

  // const [patientId, setPatientId] = useState<>(0);
  // const [followupId, setFollowupId] = useState<Number>(0);
  // const [deadlineDate, setDeadlineDate] = useState<String>("");

  const [lstFollowups, setLstFollowups] = useState<Followup[]>([]);
  
  const [searchFollowupText, setSearchFollowupText] = useState("");
  const [interFollowupText, setInterFollowupText] = useState("");

  const [searchPatientText, setSearchPatientText] = useState("");
  const [interPatientText, setInterPatientText] = useState("");

  const [searchDeadlineText, setSearchDeadlineText] = useState("");
  const [interDeadlineText, setInterDeadlineText] = useState("");

  const [searchCompletedText, setSearchCompletedText] = useState("");
  const [interCompletedText, setInterCompletedText] = useState("");

  const logout = async() => {
    if(authContext!=null){
        authContext.setAuth({awwId:"", loggedIn:false});
      }
  }

  const makingSearch = () => {
    setSearchFollowupText(interFollowupText);
    setSearchPatientText(interPatientText);
    setSearchDeadlineText(interDeadlineText);
    setSearchCompletedText(interCompletedText);
  }
  

  const filterFollowup = (lstFollowups: any[]) => {
    return lstFollowups.filter(followUp => String(followUp.followupId).startsWith(searchFollowupText))
                       .filter(followUp => String(followUp.patientId).startsWith(searchPatientText))
                       .filter(followUp => searchDeadlineText == '' ||  String(followUp.deadlineDate).localeCompare(searchDeadlineText) <= 0)
                       .filter(followUp => searchCompletedText == '' || String(followUp.completedDate).localeCompare(searchCompletedText) >=0);
  }
  
  const GetFollowupDetailsSuccess = (response:AxiosResponse) => {
    if(response.data.nullObj==false){
      setLstFollowups(response.data.lstFollowups);
    }
  };

  const GetFollowupDetails = async() => {
       const result = await Axios.get("http://localhost:8081/profileFollowup/" + authContext?.auth?.awwId)
                   .then((response)=>{console.log("fetched"); return GetFollowupDetailsSuccess(response);})
                   .catch((err)=>{console.log(err); return "error";});
      //await LocalDB.open();
      //var l = await LocalDB.getFollowUps();
      //setLstFollowups(l);
  };

  useEffect(() => {
      GetFollowupDetails();
  }, []); 

  async function sync(){
    LocalDB.open();
    await LocalDB.sync();
    await GetFollowupDetails();
    console.log(lstFollowups);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonRow className = "Title">
            <IonCol>
              <IonTitle>Home page</IonTitle>    
            </IonCol>

            <IonCol />
            <IonCol />
            <IonCol />
              <IonButton onClick = {logout}>Logout <IonIcon slot="start" icon={arrowBack} />

          </IonButton>
          </IonRow>    
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardContent>
            <IonRow className="ion-justify-content-center">
              <IonCol>
                <WorkerProfileComponent />
              </IonCol>
              <IonCol>
                <NotificationsComponent />
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        {/* <IonCard> */}
        <IonRow>
          <IonCol>
        <IonSearchbar value={interFollowupText} onIonChange={e => {setInterFollowupText(e.detail.value!)}} 
        placeholder = "Search by Followup ID" animated showCancelButton="focus"  autocomplete="off" color={"warning"} debounce={500}>
        </IonSearchbar>
        </IonCol>
        <IonCol>
        <IonSearchbar value={interPatientText} onIonChange={e => {setInterPatientText(e.detail.value!)}} 
        placeholder = "Search by Patient ID" animated showCancelButton="focus"  autocomplete="off"  color={"warning"} debounce={500}>
        </IonSearchbar>
        </IonCol>
        <IonCol>
        <IonSearchbar value={interDeadlineText} onIonChange={e => {setInterDeadlineText(e.detail.value!)}} 
        placeholder = "Search by deadline before date" animated showCancelButton="focus"  autocomplete="off" color = {"warning"} debounce={500}>
        </IonSearchbar>
        </IonCol>
        <IonCol>
        <IonSearchbar value={interCompletedText} onIonChange={e => {setInterCompletedText(e.detail.value!)}} 
        placeholder = "Search by completed after date" animated showCancelButton="focus"  autocomplete="off" color = {"warning"} debounce={500}>
        </IonSearchbar>
        </IonCol>
        </IonRow> 
      
        <IonButton onClick = {makingSearch}> Search by above parameters <IonIcon slot="start"/>
          </IonButton>
        
  
        {/* </IonCard> */}

        <IonCard>
          <IonCardContent>
              <ul>{/* <PatientComponent /> */}
              {filterFollowup(lstFollowups).map((followup, index) => {
           
                return (
                  <IonRow className="ion-justify-content-center">
                    <PatientComponent key={index} {...followup} /> 
                  </IonRow>
                );
              })}
              </ul>
          </IonCardContent>
        </IonCard>
        <IonButton onClick={sync}>Sync</IonButton>
        </IonContent>
    </IonPage>
  );
};

export default Home;