import { IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonInput,
    IonButton } from '@ionic/react';
import React, {useState, useEffect} from 'react';
import LoginClient from '../httpClient/LoginClient';


const Login: React.FC = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    function loginUser(){ // use an effect instead
        LoginClient.login("a", "a");
    }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Anganwaadi App-Login page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput placeholder="Username?" onIonChange={(e: any) => setUsername(e.target.value)} />
        <IonInput placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} />
        <IonButton onClick={loginUser}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
