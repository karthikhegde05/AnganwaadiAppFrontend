import Axios, {AxiosResponse} from 'axios';
import RestPath from './RestPath';

export default class SyncClient{

    static async sync(aww_id:string, timestamp: string){

        var serviceurl = RestPath.baseUrl + RestPath.sync;
        var arguements = aww_id + "/"+ timestamp;

        var url = serviceurl+arguements;
        
        console.log(url);

        var response = await Axios.get(url);
        return response.data;
        // then((response) => {console.log(response.data)})
        // .catch((err) => {console.log(err)});


    }
}