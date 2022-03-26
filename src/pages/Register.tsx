import { IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonInput,
    IonButton } from '@ionic/react';
import React, {useState, useEffect} from 'react';
import LocalDB from '../storage/LocalDB';
import SyncClient from '../httpClient/SyncClient';

const Register: React.FC = () => {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    function open(){
      LocalDB.open();
    }

    function reset(){
      LocalDB.reset();
    }

    function test(){
      LocalDB.test();
    }

    async function registerUser(){ // use an effect instead
        // LocalDB.reset();
        // await LocalDB.open();
        // await LocalDB.init();
        // LocalDB.close();

        
        // await LocalDB.open();
        // console.log("wowow");
        await LocalDB.sync();
        // console.log("asasa");
        // LocalDB.close();

    }

    function sync(){
      LocalDB.sync();
    }

    function init(){
      LocalDB.init();
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
        <IonButton onClick={sync}>sync</IonButton>
        <IonButton onClick={open}>Open</IonButton>
        <IonButton onClick={reset}>Reset</IonButton>
        <IonButton onClick={test}>Test</IonButton>
        <IonButton onClick={init}>Init</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
