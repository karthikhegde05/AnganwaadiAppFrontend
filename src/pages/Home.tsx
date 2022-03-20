import { IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { RouteComponentProps, useLocation, useParams } from 'react-router';
import HomeSearchBar from '../components/HomeSearchBar';
import NotificationsComponent from '../components/NotificatonsComponent';
import PatientComponent from '../components/PatientComponent';
import WorkerProfileComponent from '../components/WorkerProfileComponent';
import Login from './Login';
import './Home.css';

const Home: React.FC = () => {

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
            <IonRow className="ion-justify-content-center">
              <PatientComponent />
            </IonRow>
          </IonCardContent>
        </IonCard>
        </IonContent>
    </IonPage>
  );
};

export default Home;
