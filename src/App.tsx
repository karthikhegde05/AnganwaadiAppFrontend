import { Redirect, Route, withRouter } from 'react-router-dom';
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
import WorkerProfilePage from './pages/WorkerProfileDisplay';
import NotificationsPage from './pages/NotificationsPage';
import PatientComponent from './components/PatientComponent';
import PatientProfilePage from './pages/PatientProfilePage';
import useAuth from './hooks/useAuth';
import FollowupFormComponent from './pages/FollowupForm';
import FollowupForm from './pages/FollowupForm';
import FollowUpDisplay from './pages/FollowUpDisplay';

setupIonicReact();



const App: React.FC = () => {
  
  const authContext = useAuth();
  
  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        {/* Require user authentication (logged in criteria)*/}
        <Route exact path="/home" render={(props)=> {
          return (
          // authContext?.auth?.loggedIn
          //   ? <Home />
          //   : <Redirect to="/login" />

          <Home />
          );
        }} />
        {/* <Route exact path="/patientProfile" render={(props)=>{
          return (
            // authContext?.auth?.loggedIn
            // ?<PatientProfilePage />
            // : <Redirect to="/login" />

            <PatientProfilePage />
          );
        }} /> */}
        <Route exact path="/patientProfile" component={PatientProfilePage} />
        <Route exact path="/workerProfile" render={(props)=>{
          return (
            // authContext?.auth?.loggedIn
              // ? <WorkerProfilePage />
              // : <Redirect to="/login" />

              <WorkerProfilePage />
          );
        }} />
        <Route exact path="/notifications" render = {(props)=>{
          return (
            authContext?.auth?.loggedIn
              ? <NotificationsPage />
              : <Redirect to="/login" />
          );
        }} />
      <Route exact path="/followupForm" render = {(props) => {
        return (
          // authContext?.auth?.loggedIn 
          //   ? <FollowupForm />
          //   : <Redirect to="/login" />
          <FollowupForm/>
        )
      }} />

      <Route exact path="/followupDisplay" render = {(props) => {
        return (<FollowUpDisplay/>)
      }} />

        {/* do not require user authentication */}
        {/* once logged in the user must not get to these pages*/}
        <Route exact path="/login" render = {(props) => {
          return (
            authContext?.auth?.loggedIn
              ? <Redirect to="/home" />
              : <Login {...props} />
          );
        }} />
        <Route exact path="/register" render = {(props)=>{
          return (
            authContext?.auth?.loggedIn
              ? <Redirect to="/home" />
              : <Register />
          );
        }} />
        <Route exact path="/" render={(props)=> {
          return (
            authContext?.auth?.loggedIn
              ? <Redirect to="/home" />
              : <Redirect to="/login" />
          );
        }} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
};

export default (App);
