import { IonButton, IonButtons, IonCard, IonCardContent, IonCheckbox, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSearchbar, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonTitle, IonToolbar, RefresherEventDetail, SearchbarChangeEventDetail, useIonModal, useIonToast } from '@ionic/react';
import { RouteComponentProps, useLocation, useParams, useHistory } from 'react-router-dom';
import HomeSearchBar from '../components/HomeSearchBar';
import NotificationsComponent from '../components/NotificatonsComponent';
import PatientComponent from '../components/PatientComponent';
import WorkerProfileComponent from '../components/WorkerProfileComponent';
import Login from './Login';
import './Home.css';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import Axios, { AxiosResponse } from 'axios';
import PatientProfilePage from './PatientProfilePage';
import LocalDB from '../storage/LocalDB';
import { funnel, personCircleOutline, logOutOutline, caretForward, checkmark } from 'ionicons/icons';
import { ListenOptions } from 'net';
import FollowUpListItem from '../components/FollowUpListItem';
import SyncClient from '../httpClient/SyncClient';

type Followup = {
  followupId: Number,
  deadlineDate: String,
  completedDate: String,
  hasCompleted: boolean,
  patientId: Number
}

type HomeScreenFollowUp = {
  followupId:number,
  deadlineDate:string,
  completedDate:string,
  address:string,
  city:string,
  patientId:number
};


//import {giveSearchText} from '../components/HomeSearchBar';

const Home: React.FC = () => {

  const authContext = useAuth();
  const location = useLocation();

  const history = useHistory();

  // upcoming
  const [delayedFollowUps, setDelayedFollowUps] = useState<HomeScreenFollowUp[]>([]);
  const [todayFollowUps, setTodayFollowUps] = useState<HomeScreenFollowUp[]>([]);
  const [thisWeekFollowUps, setThisWeekFollowUps] = useState<HomeScreenFollowUp[]>([]);
  const [laterFollowUps, setLaterFollowUps] = useState<HomeScreenFollowUp[]>([]);

  // completed
  const [editableFollowUps, setEditableFollowUps] = useState<HomeScreenFollowUp[]>([]);
  const [nonEditableFollowUps, setNonEditableFollowUps] = useState<HomeScreenFollowUp[]>([]);

  
  const [filter, setFilter] = useState<FilterState>({status:"upcoming", address:"", city:""});



  const [showFilterModal, dismissFilterModal] = useIonModal(FilterModal, {
    filterState: filter,
    updateState: function(){console.log(filter)}
  });

  const [showToast, dismissToast] = useIonToast();


  const logout = async() => {
    if(authContext!=null){
        authContext.setAuth({awwId:"", loggedIn:false});
      }
  }

  const showProfile = () => {

    history.push("/workerProfile");

  }
  

  const filterFollowup = (lstFollowups: HomeScreenFollowUp[]) => {

      return lstFollowups
        .filter(followUp => String(followUp.address).startsWith(filter.address))
        .filter(followUp => String(followUp.city).startsWith(filter.city))
        .filter(followUp =>
          ((followUp.completedDate !== null) && (filter.status == 'completed')) ||
          ((followUp.completedDate === null) && (filter.status == 'upcoming'))
        );
  }

  const upcomingFollowUpBinning = (result: HomeScreenFollowUp[]) => {
    const date = new Date();
      const today = date.toISOString().split("T")[0]; 
      //split1 : index of first followup not in the past
      const split1 = result.findIndex((followUp:HomeScreenFollowUp) => {
        return (today.localeCompare(followUp.deadlineDate) != 1);
      });

      console.log(split1);

      if(split1 == -1){
        setDelayedFollowUps(result);
        setTodayFollowUps([]);
        setThisWeekFollowUps([]);
        setLaterFollowUps([]);
        return;
      }
      //if there are delayed followups
      else if(split1 != 0){
        setDelayedFollowUps(result.slice(0,split1));
      }

      date.setDate(date.getDate() + 1);
      const tomorrow = date.toISOString().split("T")[0];

      const split2 = result.findIndex((followUp:HomeScreenFollowUp) => {
        return (tomorrow.localeCompare(followUp.deadlineDate) != 1);
      });

      if(split2 == -1){
        setTodayFollowUps(result.slice(split1));
        setThisWeekFollowUps([]);
        setLaterFollowUps([]);
        return;
      }

      setTodayFollowUps(result.slice(split1, split2));

      date.setDate(date.getDate() + 7);
      const nextWeek = date.toISOString().split("T")[0];

      const split3 = result.findIndex((followUp:HomeScreenFollowUp) => {
        return (nextWeek.localeCompare(followUp.deadlineDate) != 1);
      });

      if(split3 == -1){
        setThisWeekFollowUps(result.slice(split2));
        setLaterFollowUps([]);
        return;
      }

      setThisWeekFollowUps(result.slice(split2, split3));
      setLaterFollowUps(result.slice(split3));
  }

  const completedFollowupBinning = (result: HomeScreenFollowUp[], last_sync:string) => {
    

    console.log(result);
    const split4 = result.findIndex((followUp:HomeScreenFollowUp) => {
      return (last_sync.localeCompare(followUp.completedDate) == -1);
    });
    console.log(last_sync);
    console.log(split4)

    if(split4 == -1){
      setEditableFollowUps([]);
      setNonEditableFollowUps(result);
      return;
    }

    setNonEditableFollowUps(result.slice(0,split4));
    setEditableFollowUps(result.slice(split4));
  }
  

  const GetFollowupDetails = async() => {

      await LocalDB.open();
      console.log("fetched");
      var result = await LocalDB.getHomeScreenFollowUps("upcoming");

      console.log(result);

      upcomingFollowUpBinning(result);

      result = await LocalDB.getHomeScreenFollowUps("completed");
      const last_sync = await LocalDB.getLastSync();

      completedFollowupBinning(result, last_sync);
     
      
      // console.log(split4);
      // console.log(editableFollowUps);
      // console.log(last_sync);


  };
  
  useEffect(() => {
      GetFollowupDetails();
  }, [location]); 

  async function sync(event: CustomEvent<RefresherEventDetail>){
    // LocalDB.open();
    // await LocalDB.sync();
    // await GetFollowupDetails();
    // console.log(lstFollowups);
    // console.log(laterFollowUps);

    const result = await SyncClient.sync();

    if(!result){
      showToast("Sync Failed. Device is Offline", 3000);
      event.detail.complete();
      return;
    }

    setTimeout(() => {
      GetFollowupDetails();
      event.detail.complete();    
    }, 2000);
    
    
  }

  

  function fabFilterModal(){
    showFilterModal();
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          
            <IonButtons slot='start'>
              <IonButton onClick={showProfile}><IonIcon icon={personCircleOutline} slot='start' /> profile</IonButton>
            </IonButtons>
            
            <IonButtons slot='end'>
              <IonButton onClick = {logout} slot='end'>logout<IonIcon icon={logOutOutline} slot='end'/></IonButton>
            </IonButtons>
            
              
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot='fixed' onIonRefresh={sync}><IonRefresherContent /></IonRefresher>

        {(filter.status == "upcoming")?(
        <>
          {(delayedFollowUps != [])?(<IonList>
            <IonListHeader  color='danger'>Delayed</IonListHeader>
            {filterFollowup(delayedFollowUps).map((followup,index) =>{
              return (
                <HomeScreenFollowUpListItem key={index} {...followup}/>
              );
            })}
          </IonList>):(<div></div>)}
          {(todayFollowUps != [])?(<IonList>
            <IonListHeader color='warning'>Today</IonListHeader>
            {filterFollowup(todayFollowUps).map((followup,index) =>{
              return (
                <HomeScreenFollowUpListItem key={index} {...followup}/>
              );
            })}
          </IonList>):(<div></div>)}{(thisWeekFollowUps != [])?(<IonList>
            <IonListHeader color="success">This Week</IonListHeader>
            {filterFollowup(thisWeekFollowUps).map((followup,index) =>{
              return (
                <HomeScreenFollowUpListItem key={index} {...followup}/>
              );
            })}
          </IonList>):(<div></div>)}{(laterFollowUps != [])?(<IonList>
            <IonListHeader color="success">Later</IonListHeader>
            {filterFollowup(laterFollowUps).map((followup,index) =>{
              return (
                <HomeScreenFollowUpListItem key={index} {...followup}/>
              );
            })}
          </IonList>):(<div></div>)}
        </>
        ):(
        <>
          {(delayedFollowUps != [])?(<IonList>
            <IonListHeader>Editable</IonListHeader>
            {filterFollowup(editableFollowUps).map((followup,index) =>{
              return (
                <HomeScreenFollowUpListItem key={index} {...followup}/>
              );
            })}
          </IonList>):(<div></div>)}
          {(todayFollowUps != [])?(<IonList>
            <IonListHeader>Commited</IonListHeader>
            {filterFollowup(nonEditableFollowUps).map((followup,index) =>{
              return (
                <HomeScreenFollowUpListItem key={index} {...followup}/>
              );
          })}
           </IonList>):(<div></div>)}
        
        </>)}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton onClick={fabFilterModal}><IonIcon icon={funnel} /></IonFabButton>
        </IonFab>
        </IonContent>
    </IonPage>
  );
};

type historyTypeProps = {
  patientId: Number
}

const HomeScreenFollowUpListItem: React.FC<HomeScreenFollowUp> = (props: HomeScreenFollowUp) =>{

  const history = useHistory<historyTypeProps>();
  var pressed:boolean = false;

  const today = new Date().toISOString().split("T")[0];
  var color;

  if(props.completedDate === null)
    color = (props.deadlineDate.localeCompare(today) == -1)? "danger":(props.deadlineDate.localeCompare(today) == 0?"warning":"success");
  else
    color = "default";

  const redirectToPatientProfile = () =>{
    // console.log("a");
    history.push({pathname:"patientProfile", state: {patientId: props.patientId}})
  };

  return (
      <IonItem color={color}>
          <IonLabel>
              <h1>{props.city}</h1>
              <h2>{props.address}</h2>
              <h2>{props.deadlineDate}</h2>
          </IonLabel>

          <IonButton disabled={pressed} onClick={redirectToPatientProfile}><IonIcon icon={caretForward}/></IonButton>
      </IonItem>
  );
};

type FilterState = {
  status: string
  address: string
  city: string
}

type FilterProps = {
  filterState: FilterState
  updateState: () => void
}

const FilterModal: React.FC<FilterProps> = (props: FilterProps) =>{


  return (
    <IonPage>
      <IonHeader>
          <IonToolbar>
            <IonTitle>Filter</IonTitle>
            <IonButtons slot='end'>
              <IonButton>apply<IonIcon icon={checkmark} slot='end' /></IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
      <IonContent>
        
        <IonList>
          <IonItem>
            <IonLabel>Status</IonLabel>
            <IonSelect value={props.filterState.status} onIonChange={(e)=> {props.filterState.status = e.detail.value; props.updateState()} }>
              {/* <IonSelectOption value="all">All</IonSelectOption> */}
              <IonSelectOption value="completed">Completed</IonSelectOption>
              <IonSelectOption value="upcoming">Upcoming</IonSelectOption>
              {/* <IonSelectOption value="delayed">Delayed</IonSelectOption> */}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Address</IonLabel>
            <IonInput type="text" value = {props.filterState.address} onIonChange={(e)=> {props.filterState.address = e.detail.value!; props.updateState()} }/>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">City</IonLabel>
            <IonInput type="text" value = {props.filterState.city} onIonChange={(e)=> {props.filterState.city = e.detail.value!; props.updateState()} }/>
          </IonItem>
        </IonList>
    </IonContent>
    </IonPage>

  )
}

export default Home;


