import {IonButton, IonCol, IonContent, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar} from '@ionic/react';
import Axios, { AxiosResponse } from 'axios';
import { arrowBack, star } from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import useAuth from '../hooks/useAuth';


const WorkerProfilePage: React.FC = () => {

    
    const [name, setName] = useState<String>("unknown name");
    const [contactNum, setContactNum] = useState<String>("unknown number");

    const [username, setUsername] = useState<String>("unknown username");
    const [email, setEmail] = useState<String>("unknown email");
    const [role, setRole] = useState<String>("unknown role");

    const [angAdd, setAngAdd] = useState<String>("unknown address");
    const [angLoc, setAngLoc] = useState<String>("unknown location");
    

    const authContext = useAuth();
    const logout = async() => {
        if(authContext!=null){
            authContext.setAuth({awwId:"", loggedIn:false});
          }
    }

    const GetDetailsSuccess = (response:AxiosResponse) => {
        if(response.data.nullObj==false){
            setName(response.data.name);
            setContactNum(response.data.contactNumber);
            
            setUsername(response.data.username);
            setEmail(response.data.email);
            setRole(response.data.role);

            setAngAdd(response.data.anganwaadiAddress);
            setAngLoc(response.data.anganwaadiLocation);
        }
    };

    const GetDetails = async() => {
        const result = await Axios.get("http://localhost:8081/workerProfile/" + authContext?.auth?.awwId)
                    .then((response)=>{return GetDetailsSuccess(response);})
                    .catch((err)=>{console.log(err); return "error";});
    };

    useEffect(() => {
        GetDetails();
    }, []); 

    return (
        <IonPage>
            <IonHeader>
            <IonToolbar>
                <IonRow>
                    <IonCol><IonTitle>Worker Profile Page</IonTitle></IonCol>
                    <IonCol /> <IonCol /> <IonCol />
                    <IonCol> <IonButton onClick = {logout}>Logout <IonIcon slot="start" icon={arrowBack} /></IonButton></IonCol>
                </IonRow>
                
                
            </IonToolbar>
            </IonHeader>

            <IonContent>
                <h4>Add Anganwaadi worker profile related content here!</h4>

                <div>
                    <p>Name: {name}</p>
                    <p>Contact number: {contactNum}</p>
                    <p>username: {username}</p>
                    <p>email: {email}</p>
                    <p>role: {role}</p>
                    <p>anganwaadi address: {angAdd}</p>
                    <p>anganwaadi location: {angLoc}</p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default WorkerProfilePage;