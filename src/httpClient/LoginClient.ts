import Axios, { AxiosResponse } from 'axios';
import {HTTP, HTTPResponse} from "@awesome-cordova-plugins/http";
import RestPath from './RestPath';
import LocalDB from '../storage/LocalDB';
import SyncClient from './SyncClient';

type WorkerProfile = {
    aww_id:number,
    name:string,
    contact_number:string,
    username:string,
    email:string,
    aw_address:string,
    aw_location:string
}

export default class LoginClient{
    
    private static http = HTTP;

    static async login(userID:String, password:String):Promise<String>{
        
        //"http://172.16.128.125:8081/login"
        var url = "http://192.168.249.1:8081/login"
        return Axios.post(url,
        {
            "userID":userID,
            "password":password
        }
        ).then((response) => {return this.loginSuccess(response)}).
        catch(function (error){console.log(error); return "error"});
        
    }

    private static loginSuccess(response: AxiosResponse): String{

        // console.log(response.data);
        if(response.data.result=="valid"){
            console.log(response.data.awwId);
            return "valid";
        }
        else
            return "invalid";

    }

    static async check(username:string, password:string):Promise<boolean>{

        var url = RestPath.baseUrl + RestPath.login;
        this.http.setDataSerializer('json');
        var result = await this.http.post(url, {userID:username, password:password}, {});
        var r = JSON.parse(result.data);

        console.log(r);

        if(r.result === "valid"){

            console.log("valid");

            LocalDB.reset();
            const w:WorkerProfile = {
                aww_id: r.worker.awwId,
                name: r.worker.name,
                contact_number: r.worker.contactNo,
                username: username,
                email: "e",
                aw_address: r.worker.address,
                aw_location: r.worker.locality
            }; 
            await LocalDB.open();
            await LocalDB.init(w, username, password);
            // await SyncClient.sync();
            return true;
        }
        else{
            
            return false;
        }
    }

    



};

// {
//     "sam_ID": "abcd",
//     "deadline_date": "2020-12-31T15:53:16",
//     "completed_date": "2020-12-31T15:53:16",
//     "healthStatus": null,
//     "completed": true,
//     "createdDate": "2020-12-31T15:53:16",
//     "aww_id": 99
// }