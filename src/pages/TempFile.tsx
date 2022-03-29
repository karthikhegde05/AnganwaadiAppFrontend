import { IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenu, IonMenuButton, IonPage, IonRouterOutlet, IonSplitPane, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router';
import HomeSearchBar from '../components/HomeSearchBar';

const TempFile: React.FC = () => {
  return (
     <IonPage>
         <IonHeader>
             <IonToolbar>
                 <IonButtons slot="start">
                    <IonMenuButton color="dark"></IonMenuButton>
                 </IonButtons>
                 <IonTitle>Testing menus</IonTitle>
             </IonToolbar>
         </IonHeader>
         <IonContent>
            <p>hello</p>
         </IonContent>
     </IonPage>
  );
};

export default TempFile;
