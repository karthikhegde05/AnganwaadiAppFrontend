import {IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonImg, IonThumbnail, IonText, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from '@ionic/react';
import Axios, { AxiosResponse } from 'axios';
import { arrowBack, callOutline, homeOutline, locationOutline, mailOutline, peopleCircleOutline, peopleOutline, personOutline, star } from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
//import { useTable } from 'react-table';
import useAuth from '../hooks/useAuth';
import styled from 'styled-components';
//import DataTable from 'react-data-table-component';
import { moon } from "ionicons/icons";
import styles from "./WorkerProfilePage.module.scss";

import { arrowBackOutline, arrowForward, bookmarkOutline, chatboxEllipsesOutline, ellipsisHorizontal, imageOutline, personAddOutline } from "ionicons/icons";
import { useLocation } from 'react-router-dom';

const WorkerProfilePage:React.FC = () => {

    const [name, setName] = useState<String>("unknown name");
    const [contactNum, setContactNum] = useState<String>("unknown number");

    const [username, setUsername] = useState<String>("unknown username");
    const [email, setEmail] = useState<String>("unknown email");
    const [role, setRole] = useState<String>("unknown role");

    const [angAdd, setAngAdd] = useState<String>("unknown address");
    const [angLoc, setAngLoc] = useState<String>("unknown location");

    const authContext = useAuth();

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

    const Title = styled(IonTitle)`
        font-size: 1.5em;
        text-align: center;
        color: black;
    `;

	return (

		<IonPage className={ styles.home }>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">

						<IonButton color="light">
							<IonIcon icon={ arrowBackOutline } />
						</IonButton>
					</IonButtons>

                    <IonCol><Title>Worker Profile Page</Title></IonCol>

					{/*<IonButtons slot="end">
						<IonButton color="light">
							<IonIcon icon={ ellipsisHorizontal } />
						</IonButton>
                    </IonButtons>*/}
				</IonToolbar>
			</IonHeader>
			<IonContent>

				<div className={ styles.topHeader }></div>

				<IonGrid>
					<IonRow className="ion-justify-content-center">
						<IonCol size="12" className="ion-justify-content-center ion-align-items-center ion-text-center">
							<IonCard className={ styles.profileHeader }>

								<IonCardContent>

									<IonRow>
										<IonCol size="3">
											<img src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/IIIT_Bangalore_Logo.svg/1200px-IIIT_Bangalore_Logo.svg.png" alt="avatar" className={ styles.avatar } />
										</IonCol>
                                        <IonCol /><IonCol />

										<IonCol size="8">
											<IonRow className={ styles.profileInfo }>
												<IonCol size="12">
													<IonText color="dark" className={ styles.profileName }>
														<p>{name}</p>
													</IonText>
													<IonText color="medium">
														<p>Anganwadi Worker</p>
													</IonText>
												</IonCol>
											</IonRow>
										</IonCol>
									</IonRow>

									{/*<IonRow>
										<IonCol size="6">
											<IonButton fill="outline" expand="block">
												Message
											</IonButton>
										</IonCol>
										<IonCol size="6">
											<IonButton color="primary" expand="block">
												<IonIcon icon={ personAddOutline } size="small" />&nbsp;
												Follow
											</IonButton>
										</IonCol>
                                    </IonRow>*/}
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>

					<IonRow className={ styles.profileStatusContainer }>
						<IonCol size="6">
							<IonCard className={ styles.profileCard }>

								<IonCardHeader>
									<IonRow className={ styles.profileStatus }>
										<IonIcon icon={ personOutline } />
										<IonCardTitle>{username}</IonCardTitle>
                                        <IonCardSubtitle>Username</IonCardSubtitle>
									</IonRow>
								</IonCardHeader>
								{/*<IonCardContent>
									<IonText>
										<p></p>
									</IonText>
                                </IonCardContent>*/}
							</IonCard>
						</IonCol>

                        <IonCol size="6">
							<IonCard className={ styles.profileCard }>

								<IonCardHeader text-wrap>
									<IonRow className={ styles.profileStatus }>
										<IonIcon icon={ mailOutline } />
										<IonCardTitle>{email}</IonCardTitle>
                                        <IonCardSubtitle>Email</IonCardSubtitle>
									</IonRow>
								</IonCardHeader>
							</IonCard>
						</IonCol>
					</IonRow>

					<IonRow>
						<IonCol size="6">
							<IonCard className={ styles.profileCard }>
								<IonCardContent>
									<IonIcon icon={ homeOutline } />
									<IonCardTitle>{angAdd}</IonCardTitle>
									<IonCardSubtitle>Anganwadi Address</IonCardSubtitle>
								</IonCardContent>
							</IonCard>
						</IonCol>

						<IonCol size="6">
							<IonCard className={ styles.profileCard }>
								<IonCardContent>
									<IonIcon icon={ locationOutline } />
									<IonCardTitle>{angLoc}</IonCardTitle>
									<IonCardSubtitle>Anganwadi Location</IonCardSubtitle>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>

                    <IonRow>
						<IonCol size="6">
							<IonCard className={ styles.profileCard }>
								<IonCardContent>
									<IonIcon icon={ callOutline } />
									<IonCardTitle>{contactNum}</IonCardTitle>
									<IonCardSubtitle>Contact Numbers</IonCardSubtitle>
								</IonCardContent>
							</IonCard>
						</IonCol>

						<IonCol size="6">
							<IonCard className={ styles.profileCard }>
								<IonCardContent>
									<IonIcon icon={ peopleCircleOutline } />
									<IonCardTitle>{role}</IonCardTitle>
									<IonCardSubtitle>Role</IonCardSubtitle>
								</IonCardContent>
							</IonCard>
						</IonCol>
					</IonRow>

				</IonGrid>
				
			</IonContent>
		</IonPage>
	);
};

export default WorkerProfilePage;