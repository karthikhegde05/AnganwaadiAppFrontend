import {IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonPage, IonRow, IonTitle, IonToolbar} from '@ionic/react';
import React, {useState} from 'react';
import TakeFollowupComponent from '../components/TakeFollowupComponent';


const PatientProfilePage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
            <IonToolbar>
                <IonTitle>Patient Profile Page</IonTitle>
            </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonCard>
                    <IonCardContent>
                        <IonRow  className="ion-justify-content-center">
                            <h4>Discharge Summary : button/ text</h4>
                        </IonRow>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <IonRow  className="ion-justify-content-center">
                            <TakeFollowupComponent />
                        </IonRow>                        
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardContent>
                        <IonRow  className="ion-justify-content-center">
                            <h4>Growth Statistics: button/image</h4>
                        </IonRow>                    
                    </IonCardContent>
                </IonCard>
            </IonContent>


        </IonPage>
    );
};

export default PatientProfilePage;