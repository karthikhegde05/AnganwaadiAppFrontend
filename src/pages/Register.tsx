import { IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonInput,
    IonButton } from '@ionic/react';
import React, {useState, useEffect} from 'react';

const Register: React.FC = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    function registerUser(){ // use an effect instead
        alert(username+ " " + password);
    }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Anganwaadi App - Registration page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput placeholder="Username?" onIonChange={(e: any) => setUsername(e.target.value)} />
        <IonInput placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} />
        <IonButton onClick={registerUser}>Register</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
