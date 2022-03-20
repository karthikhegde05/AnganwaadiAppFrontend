import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import TempFile from './pages/TempFile';
import WorkerProfilePage from './pages/WorkerProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PatientComponent from './components/PatientComponent';
import PatientProfilePage from './pages/PatientProfilePage';
import useAuth from './hooks/useAuth';

setupIonicReact();



const App: React.FC = () => {
  
  const authContext = useAuth();
  
  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        {/* Require user authentication (logged in criteria)*/}
        {/* <Route exact path="/home" component={Home}/> */}
        <Route exact path="/home" render={(props)=>(
          authContext?.auth?.loggedIn
            ? <Home />
            : <Redirect to="/login" />
        )} />
        <Route exact path="/patientProfile">
          <PatientProfilePage />
        </Route>
        <Route exact path="/workerProfile">
          <WorkerProfilePage />
        </Route>
        <Route exact path="/notifications">
          <NotificationsPage />
        </Route>

        {/* do not require user authentication */}
        <Route exact path="/login" component={Login} />
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
};

export default App;
