import Axios, { AxiosResponse } from 'axios';

export default class LoginClient{

    

    static login(id:String, password:String):String{
        
        
        Axios.get("http://localhost:8081/login/1").then((response) => {this.loginSuccess(response)}).catch(function (error){console.log(error)});
        
        return "string";
    }

    private static loginSuccess(response: AxiosResponse){

        
        console.log(response.data);

    }



};