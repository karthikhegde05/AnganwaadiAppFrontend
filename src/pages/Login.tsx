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
    IonCol} from '@ionic/react';
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
      alert("moved to home");
    }

    async function login(){
      LoginClient.login(username, password, moveToHome);
    }
    
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Anganwaadi App-Login page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        
        <IonGrid>
          <IonRow class="ion-justify-content-center">
            <IonCol size='auto'>
                <IonInput placeholder="Username?" onIonChange={(e: any) => setUsername(e.target.value)} />
            
                <IonInput placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} clearInput={true} />
            </IonCol>
          </IonRow>
          
          <IonRow class="ion-justify-content-center">
            <IonCol size='auto'>
            <IonButton disabled={pressed} onClick={login}>Login</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

// class Login extends React.Component {



//   render(): React.ReactNode {
//       return (    <IonPage>
//         <IonHeader>
//           <IonToolbar>
//             <IonTitle>Anganwaadi App-Login page</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent className="ion-padding">
          
//           <IonGrid>
//             <IonRow class="ion-justify-content-center">
//               <IonCol size='auto'>
//                   <IonInput placeholder="Username?" onIonChange={(e: any) => setUsername(e.target.value)} />
//               </IonCol>
//             </IonRow>
  
//             <IonRow class="ion-justify-content-center">
//               <IonCol size='auto'>
//                   <IonInput placeholder="Password?" onIonChange={(e: any) => setPassword(e.target.value)} />
//               </IonCol>
//             </IonRow>
            
//             <IonRow class="ion-justify-content-center">
//               <IonCol size='auto'>
//               <IonButton disabled={pressed} onClick={loginUser}>Login</IonButton>
//               </IonCol>
//             </IonRow>
//           </IonGrid>
  
//         </IonContent>
//       </IonPage>);
//   }

// }

export default Login;
