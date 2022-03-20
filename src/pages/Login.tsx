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
    IonCardContent,
    IonMenuButton,
    IonButtons,
    IonRouterOutlet} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import { IonReactRouter } from '@ionic/react-router';
import MenuContainer from '../components/MenuContainer';
import LoginClient from '../httpClient/LoginClient';
import "./Login.css"
import { RouteComponentProps } from 'react-router';
import  Axios, {AxiosResponse } from 'axios';


const Login: React.FC<RouteComponentProps> = ({history}) => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const router = useIonRouter();
    var pressed:boolean = false;
    var awwId:any = 0;

    const navigateToRegistration = () => {
      history.push("/register")
    };

    const loginSuccess = (response: AxiosResponse) => {
      if(response.data.result=="valid"){
        awwId = response.data.awwId;
        return "valid";
      }
      else
          return "invalid";
    };

    async function login(){
      const result = await Axios.post("http://localhost:8081/login",
      {
          "userID":username,
          "password":password
      }
      ).then((response) => {return loginSuccess(response);}).
      catch(function (error){console.log(error); return "error"});

      if(result == "valid"){
        history.push({
          pathname: `/home/${awwId}`,
          state: {awwId:awwId, authd:true}
        });
      }
      else if(result == "invalid"){
        alert("wrong password");
      }
      else if(result == "error"){
        alert("there was a problem connecting to the server");
      }

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
                <IonInput className="credential" type="password" placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} clearInput={true} />
                <IonRow className="ion-justify-content-center">
                  <IonButton disabled={pressed} onClick={login}>Login</IonButton>
                </IonRow>
                <IonRow className="ion-padding ion-justify-content-center">
                    <p onClick={navigateToRegistration}>forget password?</p>
                </IonRow>
            </IonCardContent>
          </IonCard>
        </IonContent>    
      </IonPage>
    );
};



export default Login;


