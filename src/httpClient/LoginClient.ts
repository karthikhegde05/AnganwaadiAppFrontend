import Axios, { AxiosResponse } from 'axios';

export default class LoginClient{
    

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