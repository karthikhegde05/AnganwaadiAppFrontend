import { IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
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

const Home: React.FC = () => {

  const authContext = useAuth();

  // const [patientId, setPatientId] = useState<>(0);
  // const [followupId, setFollowupId] = useState<Number>(0);
  // const [deadlineDate, setDeadlineDate] = useState<String>("");

  const [lstFollowups, setLstFollowups] = useState([]);
  
  const GetFollowupDetailsSuccess = (response:AxiosResponse) => {
    if(response.data.nullObj==false){
      setLstFollowups(response.data.lstFollowups);
    }
  };

  const GetFollowupDetails = async() => {
      const result = await Axios.get("http://localhost:8081/profileFollowup/" + authContext?.auth?.awwId)
                  .then((response)=>{console.log("fetched"); return GetFollowupDetailsSuccess(response);})
                  .catch((err)=>{console.log(err); return "error";});
  };

  useEffect(() => {
      GetFollowupDetails();
  }, []); 

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home page</IonTitle>        
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* <IonCard> */}
        <HomeSearchBar />
        {/* </IonCard> */}

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

        <IonCard>
          <IonCardContent>
              <ul>{/* <PatientComponent /> */}
              {lstFollowups.map((followup, index) => {
           
                return (
                  <IonRow className="ion-justify-content-center">
                    <PatientComponent key={index} {...followup} /> 
                  </IonRow>
                );
              })}
              </ul>
          </IonCardContent>
        </IonCard>
        </IonContent>
    </IonPage>
  );
};

export default Home;
