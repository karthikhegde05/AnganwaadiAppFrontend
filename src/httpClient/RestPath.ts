export default class RestPath{
    
    static baseUrl: string = "http://f29a-119-161-98-68.in.ngrok.io/";

    //sync
    static pullFollowUps: string = "sync/followup/";
    static pullPatient: string = "sync/patient/";
    static pushFollowUps: string = "followup/update";
    static auth: string = "auth";

    //login
    static login: string = "login/"

    //test
    static sync: string = "test/sync/";

}

//aww_id: 99
// completed: true
// completed_date: "2020-12-31T15:53:16"
// createdDate: "2020-12-31T15:53:16"
// deadline_date: "2020-12-31T15:53:16"
// healthStatus: null
// sam_ID: "abcd"