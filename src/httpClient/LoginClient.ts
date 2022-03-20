import Axios, { AxiosResponse } from 'axios';

export default class LoginClient{
    

    static login(userID:String, password:String):Promise<String>{
        
        
        return Axios.post("http://localhost:8081/login",
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