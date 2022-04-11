import { IonContent, IonSearchbar } from "@ionic/react";
import React, {useEffect, createContext, useState} from "react";

import { BehaviorSubject, Subject } from 'rxjs';

const HomeSearchBar: React.FC = () => {

    // const subject = useState<string>("");
    const [searchText, setSearchText] = useState("");

    //useEffect(()=>{
    //});

    return (
        <IonSearchbar value={searchText} onIonChange={e => {setSearchText(e.detail.value!);}} 
        animated showCancelButton="focus" autocomplete="off" color = {"danger"}>
        </IonSearchbar>
    );
};

export default HomeSearchBar;
// export { subject };