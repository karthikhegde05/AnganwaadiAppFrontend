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
import React, {useState, useEffect, useContext} from 'react';
import { IonReactRouter } from '@ionic/react-router';
import MenuContainer from '../components/MenuContainer';
import LoginClient from '../httpClient/LoginClient';
import "./Login.css"
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Link, Switch} from 'react-router-dom';
import  Axios, {AxiosResponse } from 'axios';
import { AuthContext } from '../contexts/AuthContextProvider';
import useAuth from '../hooks/useAuth';


const Login:React.FC<RouteComponentProps> = ({history}: any) => {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const authContext = useAuth();

    // const router = useIonRouter();
    var pressed:boolean = false;
   

    const navigateToRegistration = () => {
      history.push("/register")
    };

    const loginSuccess = (response: AxiosResponse) => {
      if(response.data.result=="valid"){
        // successful login
        console.log(response.data.awwId);
        if(authContext!=null){
          authContext.setAuth({awwId:response.data.awwId, loggedIn:true});
        }
        return "valid";
      }
      else
          return "invalid";
    };

    const login = async() =>{
      const result = await Axios.post("http://localhost:8081/login",
      {
          "userID":username,
          "password":password
      }
      ).then((response) => {return loginSuccess(response);}).
      catch(function (error){console.log(error); return "error"});

      if(result == "valid"){
        history.push("/home");
      }
      else if(result == "invalid"){
        alert("wrong password");
      }
      else if(result == "error"){
        alert("there was a problem connecting to the server");
      }

    };


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


