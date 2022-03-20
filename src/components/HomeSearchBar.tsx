import { IonContent, IonSearchbar } from "@ionic/react";
import React, {useState} from "react";

const HomeSearchBar: React.FC = () => {

    const [searchText, setSearchText] = useState("");

    return (
        <IonSearchbar value={searchText} onIonChange={e => {setSearchText(e.detail.value!);}} 
        showCancelButton="focus">

        </IonSearchbar>
    );
};

export default HomeSearchBar;