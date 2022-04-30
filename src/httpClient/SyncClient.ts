import Axios, {AxiosResponse} from 'axios';
import RestPath from './RestPath';
import {HTTP, HTTPResponse} from "@awesome-cordova-plugins/http";
import LocalDB from '../storage/LocalDB';

export default class SyncClient{

    private static http = HTTP;
    private static token = "";


    static async get(url:string){

        var header = {Authorization: "Bearer " + this.token};
        this.http.setDataSerializer('json');
        var result = await this.http.get(url, {}, header);
        console.log(result.data);
        return JSON.parse(result.data);
    }

    static async post(url:string, body:Object):Promise<any>{
        console.log(body);
        this.http.setDataSerializer('json');

        var header = {Authorization: "Bearer " + this.token};
        
        var result = await this.http.post(url, body, header);
        // console.log(typeof result.data);
        var c = result.data.charAt(0);
        if(c != "[" && c != "{")
            return result.data;
        
        return JSON.parse(result.data);
    }

    static async postObject(url:string, body:Object):Promise<any>{
        console.log(body);
        // this.http.setDataSerializer('json');
        var result = await this.http.post(url, body, {});
        if(typeof result.data === 'string' || result.data instanceof String)
            return result.data;
        

        return JSON.parse(result.data);
    }

    static async getToken(){

        const url = RestPath.baseUrl + RestPath.auth;
        var cred = await LocalDB.getLoginCredentials();
        this.http.setDataSerializer('json');
        var result = await this.http.post(url, cred, {});

        var body = JSON.parse(result.data);
        console.log(body);
        SyncClient.token = body.accessToken;    
    }

    static async sync(){

        // var result = await this.http.get("https://reqres.in/api/users?page=2", {}, {});
        // var obj = await this.get("https://reqres.in/api/users?page=2");
        // console.log(obj);
        await LocalDB.open();
        const worker = await LocalDB.getWorkerDetails();
        const lastSync = await LocalDB.getLastSync();

        console.log(lastSync);

        await this.getToken();
        

        var url = RestPath.baseUrl + RestPath.pullFollowUps + worker.aww_id + "/" + lastSync;
        
        const followUpResponse:any = await this.get(url);
        console.log(followUpResponse);
        
        const sam_ids:number[] = [];

        followUpResponse.forEach((followup:any) => {
            sam_ids.push(followup.samId);
        });


        const lastUpdates:Array<string> = await LocalDB.getLastUpdate(sam_ids);
        // console.log(lastUpdates);
        // console.log(lastUpdates.at(0));

        var body:any[] = [];

        for(var i = 0; i < sam_ids.length; i++){
            body.push({
                id:sam_ids[i],
                lastUpdate:lastUpdates[i]
            });
            
        }


        // console.log(body);

        url = RestPath.baseUrl + RestPath.pullPatient;
        
        const patientResponse = await this.post(url, body);

        console.log(patientResponse);

        const newFollowUps = await LocalDB.getNewFollowUps();

        url = RestPath.baseUrl + RestPath.pushFollowUps;

        console.log(newFollowUps);
        await this.post(url, newFollowUps);


        await LocalDB.insertFollowUps(followUpResponse);
        await LocalDB.updatePatients(patientResponse);
        var l = new Date();
        l.setHours(l.getHours() + 5);
        l.setMinutes(l.getMinutes() + 30);
        await LocalDB.setLastSync(l.toISOString().slice(0,-1));


    }

    // static async sync(aww_id:string, timestamp: string){

    //     var serviceurl = RestPath.baseUrl + RestPath.sync;
    //     var arguements = "3" + "/"+ timestamp;

    //     var url = serviceurl+arguements;
        
    //     console.log(url);

    //     var response = await Axios.get(url);

    //     return response.data;

    //     // var response = await this.http.get(url, {}, {});
    //     // console.log(response.data);
    //     // return response.data;
    //     // then((response) => {console.log(response.data)})
    //     // .catch((err) => {console.log(err)});


    // }

    
    

   
}