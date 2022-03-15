import { toastController } from '@ionic/core';
import { IonContent, 
    IonHeader, 
    IonPage, 
    IonTitle, 
    IonToolbar,
    IonInput,
    IonButton,
    useIonRouter, 
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import LoginClient from '../httpClient/LoginClient';
import "./Login.css"


const Login: React.FC = () => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const router = useIonRouter();
    var pressed:boolean = false;

    function loginUser(){ // use an effect instead
        // LoginClient.login("a", "a");
        // router.push("/register");
        // console.log(pressed);
        // pressed = true;
        // console.log(pressed);

       setPassword("a");
       console.log(password);
    }

    function moveToHome(){
      router.push("/register");
    }

    async function login(){
      const result:String = await LoginClient.login(username, password);

      if(result == "valid"){
        moveToHome();
      }
      else if(result == "invalid"){
        alert("wrong password");
      }
      else if(result == "error"){
        alert("there was a problem connecting to the server");
      }

    }


    function redirectToRegistration(){
      router.push("/register")
    }

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonCard color="warning">
            <IonCardContent className="ion-padding">
                <IonInput className="credential" placeholder="Username?" onIonChange={(e: any) => setUsername(e.target.value)} />
                <IonInput className="credential" placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} clearInput={true} />
                <IonRow className="ion-justify-content-center">
                  <IonButton disabled={pressed} onClick={login}>Login</IonButton>
                </IonRow>
                <IonRow className="ion-padding ion-justify-content-center">
                    <p onClick={redirectToRegistration}>forget password?</p>
                </IonRow>
            </IonCardContent>
          </IonCard>
        </IonContent>    
      </IonPage>
    );
};



export default Login;
