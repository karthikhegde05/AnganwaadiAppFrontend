import Axios, { AxiosResponse } from 'axios';

export default class LoginClient{

    

    static login(id:String, password:String, fun: Function):void{
        
        
        Axios.post("http://localhost:8081/login", {"userID":"hem123"}).then((response) => {this.loginSuccess(response, fun)}).catch(function (error){console.log(error)});
        
    }

    private static loginSuccess(response: AxiosResponse, fun: Function){

        if(response.data=="valid"){
            fun();
        }
        else
            alert("wrongPassword");
        console.log(response.data);

    }



};