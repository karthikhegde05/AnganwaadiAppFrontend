import Axios, {AxiosResponse} from 'axios';
import RestPath from './RestPath';
import {HTTP} from "@awesome-cordova-plugins/http";

export default class SyncClient{

    private static http = HTTP;

    

    static async sync(aww_id:string, timestamp: string){

        var serviceurl = RestPath.baseUrl + RestPath.sync;
        var arguements = "3" + "/"+ timestamp;

        var url = serviceurl+arguements;
        
        console.log(url);

        var response = await Axios.get(url);

        return response.data;

        // var response = await this.http.get(url, {}, {});
        // console.log(response.data);
        // return response.data;
        // then((response) => {console.log(response.data)})
        // .catch((err) => {console.log(err)});


    }
}