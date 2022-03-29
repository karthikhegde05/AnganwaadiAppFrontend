import { SQLite , SQLiteObject, SQLiteOriginal} from '@ionic-native/sqlite';
import Axios, {AxiosResponse}  from 'axios';
import SyncClient from '../httpClient/SyncClient';
import {SQLitePorter} from '@awesome-cordova-plugins/sqlite-porter';
import { findAllInRenderedTree } from 'react-dom/test-utils';

type Followup = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number
}



type healthStatusDTO = {

    hsId:number,
    height:number,
    weight:number,
    muac:number,
    growthStatus: string,
    otherSymptoms: string,
    date: string,
    patient: string

}

type FollowupDTO = {
    followupId: number,
    workerId: number,
    deadline_date: string,
    completed_date: string,
    completed: boolean,
    samId: string,
    healthStatus: healthStatusDTO
    createdDate: string,
}

export default class LocalDB{

    
    private static db: SQLiteObject;
    
    static async open(){

        this.db = await SQLite.create({name: 'anganwaadiLocalDB.db', location: 'default'});     
        console.log(this.db);   

    }

    static async init(){

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS sync (
            table_name string Primary key,
            last_sync datetime
        );`);

        this.db.executeSql("insert into sync values (?, ?)", ["followUp", "2000-01-01T10:00:00.000"]);

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS health_status (
            hs_id integer PRIMARY KEY,
            height real,
            weight real,
            muac real,
            growth_status string,
            other_symptoms string,
            date datetime
        );`);

        // this.db.

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS followup (
            followup_id integer PRIMARY KEY,
            sam_id integer,
            worker_id integer,
            deadline_date datetime,
            completed_date datetime,
            completed integer,
            hs_id integer,
            FOREIGN KEY(hs_id) REFERENCES health_status(hs_id)
        );`).catch(error => console.log(error));

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS worker_details (
            aww_id integer PRIMARY KEY,
            name string
        )`);

        this.db.executeSql("insert into worker_details values (?, ?)", ["1", "john"]);

    }

    static async sync(){

        var result;
        result = await this.db.executeSql('SELECT * FROM sync', []);
        var last_sync:string = result.rows.item(0).last_sync;

        result = await this.db.executeSql('SELECT * FROM worker_details', []);
        var workerId:string = result.rows.item(0).aww_id.toString();
        var response = await SyncClient.sync(workerId, last_sync);
        var newLastSync = await this.insertFollowUps(response);
        
        this.db.executeSql(`UPDATE sync SET last_sync = ? WHERE table_name = 'followup'`, [newLastSync])
        .catch((error) => {console.log(error)});

    }

    public static async getFollowUps():Promise<Followup[]>{

        var result = await this.db.executeSql(`SELECT * FROM followup`, []);

        var followupList:Followup[] = [];

        var size = result.rows.length;

        for(var i = 0; i < size; i++){

            var row = result.rows.item(i);
            followupList.push({
                followupId:row.followup_id, 
                deadlineDate:row.deadline_date,
                completedDate: row.completed_date,
                hasCompleted: row.completed,
                patientId: row.sam_id
            });
        }

        return followupList;



        
    }

    private static async insertFollowUps(followups: FollowupDTO[]):Promise<string>{

        var max:number = 0;
        var latest:string = "";

        try{
            await this.db.transaction((t) =>{
                followups.forEach((followup) =>{
           
                    var healthstatus = followup.healthStatus;
                    t.executeSql("INSERT INTO health_status values (?,?,?,?,?,?,?)", [
                        healthstatus.hsId,
                        healthstatus.height,
                        healthstatus.weight,
                        healthstatus.muac,
                        healthstatus.growthStatus,
                        healthstatus.otherSymptoms,
                        healthstatus.date
                    ]);
                    t.executeSql("INSERT INTO followup values (?,?,?,?,?,?,?)", [
                        followup.followupId,
                        followup.samId,
                        followup.workerId,
                        followup.deadline_date,
                        followup.completed_date,
                        followup.completed,
                        healthstatus.hsId
                    ]);
                    var date = new Date(followup.createdDate);
                    
                    if(max < date.getTime()){
                        max = date.getTime();
                        latest = followup.createdDate;
                    }
                    
                });

                 
            });

            return latest;
    
        }
        catch(error){

            console.log("insert failed");
            console.log(error);

            return "failed";

        }
    }

    static async test(){
        // var result = await this.db.executeSql(`select * from sync 
        // where table_name = 'followUp'`, []);
        // console.log(result.rows.item(0));

        var result = await this.db.executeSql(`SELECT * FROM followup`, []);

        var followupList:Followup[] = [];

        // followupList.push({})

        var size = result.rows.length;

        for(var i = 0; i < size; i++){

            var row = result.rows.item(i);
            followupList.push({
                followupId:row.followup_id, 
                deadlineDate:row.deadline_date,
                completedDate: row.completed_date,
                hasCompleted: row.completed,
                patientId: row.sam_id
            });
        }

        console.log(followupList);

        // er PRIMARY KEY,
        //     sam_id integer,
        //     worker_id integer,
        //     deadline_date datetime,
        //     completed_date datetime,
        //     completed integer,
        //     hs_id integer,
        //     FOREIGN KEY(hs_id) REFERENCES health_status(hs_id)

        // type Followup = {
        //     followupId: Number,
        //     deadlineDate: String,
        //     completedDate: String,
        //     hasCompleted: boolean,
        //     patientId: Number
        // }

        console.log(result.rows);


        
    }

    static close(){
        this.db.close();
    }

    static reset(){
        SQLite.deleteDatabase({name: 'anganwaadiLocalDB.db', location: 'default'});
    }
    

    //converts from db date format to rest date format
    private static dateDBtoRest(dbString:string):string{
        
        var date:Date = new Date(dbString);

        return date.toISOString();
    }

    private static dateResttoDB(restString:string):string{


        var date:Date = new Date(restString);

        return date.getFullYear().toString() + "-"
                + (date.getMonth() + 1).toString() + "-"
                + date.getDay().toString() + " "
                + date.getHours().toString() + ":"
                + date.getMinutes().toString() + ":"
                + date.getSeconds().toString() + "."
                + date.getMilliseconds();

        

    }





}

// foreign key(hs_id) references healthStatus(hs_id),

// deadline_date datetime,
//                             completed_date datetime,
//                             hs_id integer,
//                             foreign key(hs_id) references healthStatus(hs_id),
//                             completed integer,