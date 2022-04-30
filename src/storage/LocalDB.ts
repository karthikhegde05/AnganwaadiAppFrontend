import { SQLite , SQLiteObject, SQLiteOriginal} from '@ionic-native/sqlite';
import Axios, {AxiosResponse}  from 'axios';
import SyncClient from '../httpClient/SyncClient';
import {SQLitePorter} from '@awesome-cordova-plugins/sqlite-porter';
import { findAllInRenderedTree } from 'react-dom/test-utils';
import WorkerProfileComponent from '../components/WorkerProfileComponent';

type Followup = {
    followupId: Number,
    deadlineDate: String,
    completedDate: String,
    hasCompleted: boolean,
    patientId: Number,
    healthStatus:healthStatusDTO
}

type HomeScreenFollowUps = {
    followupId:number,
    deadlineDate:string,
    completedDate:string,
    address:string,
    city:string,
    patientId:number
};


type healthStatusDTO = {

    hsId:number,
    height:number,
    weight:number,
    muac:number,
    growthStatus: string,
    otherSymptoms: string,

}

type FollowupDTO = {
    followupId: number,
    workerId: number,
    deadline_date: string,
    completed_date: string,
    completed: boolean,
    samId: number,
    healthStatus: healthStatusDTO
    createdDate: string,
}

type patientDTO = {
    samId: number,
    uhId: string,
    rchId: string,
    name: string,
    age: number,
    dob: string,
    gender: string,
    address: string,
    city: string,
    contactNumber: string,
    relationshipStatus: string,
    caste: string,
    religion: string,
    bpl: string,
    referredBy: string,
    last_updated: string,
    followups: FollowupDTO[]
    dischargeSummary: Discharge | null
}

type WorkerProfile = {
    aww_id:number,
    name:string,
    contact_number:string,
    username:string,
    email:string,
    aw_address:string,
    aw_location:string
}

type Discharge = {
    dischargeId:number,
    admissionDate:string,
    admissionWeight:number,
    targetWeight:number,
    dischargeDate:string,
    dischargeWeight:number,
    outcome:string,
    treatmentProtocol:string
    samId:number
}

export default class LocalDB{

    
    private static db: SQLiteObject;
    
    static async open(){

        this.db = await SQLite.create({name: 'anganwaadiLocalDB.db', location: 'default'});     
        console.log(this.db);   

    }

    static async init(worker: WorkerProfile){

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS sync (
            table_name string Primary key,
            last_sync datetime
        );`);

        this.db.executeSql("insert into sync values (?, ?)", ["followup", "2000-01-01T10:00:00.000"]);

        this.db.executeSql(`
            CREATE TABLE IF NOT EXISTS patient (
                sam_id integer PRIMARY KEY,
                uh_id string,
                rch_id string,
                name string,
                age integer,
                dob date,
                gender string,
                address string,
                city string,
                contact_number string,
                relationship_status string,
                caste string,
                religion string,
                bpl integer,
                referred_by string,
                last_updated datetime,
                discharge_id integer
            );
        `).catch(error => console.log(error));

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS followup (
            followup_id integer PRIMARY KEY,
            sam_id integer,
            aww_id integer,
            deadline_date datetime,
            completed_date datetime,
            completed integer,
            hs_id integer,
            height real,
            weight real,
            muac real,
            growth_status string,
            other_symptoms string
        );`).catch(error => console.log(error));

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS worker_details (
            aww_id integer PRIMARY KEY,
            name string,
            contact_number string,
            aw_address string,
            aw_location string
        )`);

        this.db.executeSql("insert into worker_details values (?,?,?,?,?)", [
            worker.aww_id,
            worker.name,
            worker.contact_number,
            worker.aw_address,
            worker.aw_location
        ]);

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS discharge_summary (
            discharge_id integer PRIMARY KEY,
            admission_date datetime,
            admission_weight real,
            target_weight real,
            discharge_date datetime,
            discharge_weight real,
            outcome string,
            treatment_protocol string,
            sam_id integer
        )`);

        this.db.executeSql(`CREATE TABLE IF NOT EXISTS login (
            username string,
            password string
        )`);

        await this.db.executeSql(`INSERT into login values ("tom","pass")`);

        this.test_populate();
        type HomeScreenFollowUps = {
            name:string
        };
    }

    // static async sync(){

    //     var result;
    //     result = await this.db.executeSql('SELECT * FROM sync', []);
    //     var last_sync:string = result.rows.item(0).last_sync;

    //     result = await this.db.executeSql('SELECT * FROM worker_details', []);
    //     var workerId:string = result.rows.item(0).aww_id.toString();
    //     var response = await SyncClient.sync(workerId, last_sync);
    //     var newLastSync = await this.insertFollowUps(response);
        
    //     this.db.executeSql(`UPDATE sync SET last_sync = ? WHERE table_name = 'followup'`, [newLastSync])
    //     .catch((error) => {console.log(error)});

    // }

    static async checkLogin(username:string, password:string):Promise<boolean>{

        await this.open();
        var result = await this.db.executeSql(`SELECT * FROM login`,[]);

        if(result.rows.length == 0)
            return false;

        result = result.rows.item(0);


        if(result.username === username && result.password === password)
            return true

        return false;

    }

    static async setLastSync(newLastSync: string){
        this.db.executeSql(`UPDATE sync SET last_sync = ? WHERE table_name = 'followup'`, [newLastSync]);
    }

    static async getLastUpdate(samIds: number[]):Promise<string[]>{

        var lastSyncs:string[] = [];

        
        for(var i = 0; i < samIds.length; i++){
            var result = await this.db.executeSql(`SELECT last_updated FROM patient WHERE sam_id = ?`, [samIds[i]]);
            
            if(result.rows.length == 0){
                lastSyncs.push("2000-01-01T01:00:00");
            }
            else{
                lastSyncs.push(result.rows.item(0).last_updated);
            }
        };

        return lastSyncs;
    }

    static async getNewFollowUps(){

        var result = await this.db.executeSql(`
            SELECT * FROM followup
            WHERE completed_date > (
                SELECT last_sync from sync
                WHERE table_name = "followup"
            )
        `,[]);

        var followups:any = {};

        for(var i = 0; i < result.rows.length; i++){
            
            const f = result.rows.item(i);
            var index:string = f.followup_id.toString();
            followups[index] = {
                    hsId: f.hs_id,
                    height: f.height,
                    weight: f.weight,
                    muac: f.muac,
                    growthStatus: f.growth_status,
                    otherSymptoms: f.other_symptoms,
                    date: f.completed_date
                };
        }

        return followups;
    }

    public static async getHomeScreenFollowUps(status:string):Promise<HomeScreenFollowUps[]>{
        
        const order = (status==="completed")?"f.completed_date DESC":"f.deadline_date";
        const completed = (status==="completed")?1:0;
        var result = await this.db.executeSql(`
            SELECT f.followup_id, f.deadline_date, f.completed_date, f.sam_id, p.address, p.city
            FROM followup as f INNER JOIN patient as p
            ON f.sam_id = p.sam_id
            WHERE f.completed = ?
            ORDER BY ?
        `,[completed, order]);

        

        const size = result.rows.length;

        const followups:HomeScreenFollowUps[] = [];

        for(var i = 0; i < size; i++){
            
            const row = result.rows.item(i);
            const followup:HomeScreenFollowUps = {
                followupId: row.followup_id,
                deadlineDate: row.deadline_date,
                completedDate: row.completed_date,
                address: row.address,
                city: row.city,
                patientId: row.sam_id
            };

            followups.push(followup);
        }

        return followups;

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
                patientId: row.sam_id,
                healthStatus:{
                    hsId: row.hs_id,
                    height: row.height,
                    weight: row.weight,
                    muac: row.muac,
                    otherSymptoms: row.other_symptoms,
                    growthStatus: row.growth_status,
                }
            });
        }

        return followupList;
        
    }

    static async insertPatients(patients: patientDTO[]){
        try{
            await this.db.transaction((t) =>{
                patients.forEach((patient) =>{

                    t.executeSql("INSERT INTO patient values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                        patient.samId,
                        patient.uhId,
                        patient.rchId,
                        patient.name,
                        patient.age,
                        patient.dob,
                        patient.gender,
                        patient.address,
                        patient.city,
                        patient.contactNumber,
                        patient.relationshipStatus,
                        patient.caste,
                        patient.religion,
                        patient.bpl,
                        patient.referredBy,
                        patient.last_updated,
                        0
                    ]);
                    
                });

                 
            });
    
        }
        catch(error){

            console.log("insert patient failed");
            console.log(error);

            return "failed";

        }
    }

    private static async insertDischarge(discharges: Discharge[]){

        try{
            await this.db.transaction((t) =>{

                discharges.forEach((discharge) => {
                    console.log("inserting");
                    t.executeSql("INSERT INTO discharge_summary values (?,?,?,?,?,?,?,?,?)", [
                        discharge.dischargeId,
                        discharge.admissionDate,
                        discharge.admissionWeight,
                        discharge.targetWeight,
                        discharge.dischargeDate,
                        discharge.dischargeWeight,
                        discharge.outcome,
                        discharge.treatmentProtocol,
                        discharge.samId
                    ]);
    
                });
            });
        }
        catch(e){
            console.log("insert failed");
            console.log(e);
        }
        
    }

    public static async getLatestDischarge(samId:number):Promise<Discharge>{

        var result = await this.db.executeSql(`
            SELECT * FROM discharge_summary
            WHERE sam_id = ?
            ORDER BY discharge_date desc
            LIMIT 1
        `, [samId]);

        console.log(result.rows);
        result = result.rows.item(0);

        const discharge: Discharge = {
            dischargeId: result.discharge_id,
            admissionDate: result.admission_date,
            admissionWeight: result.admission_weight,
            targetWeight: result.target_weight,
            dischargeDate: result.discharge_date,
            dischargeWeight: result.discharge_weight,
            outcome: result.outcome,
            treatmentProtocol: result.treatment_protocol,
            samId: result.sam_id
        };

        return discharge;
    }

    static async insertFollowUps(followups: FollowupDTO[]):Promise<string>{

        var max:number = 0;
        var latest:string = "";

        try{
            await this.db.transaction((t) =>{
                followups.forEach((followup) =>{
           
                    var healthstatus = followup.healthStatus;
                    t.executeSql("INSERT INTO followup values (?,?,?,?,?,?,?,?,?,?,?,?)", [
                        followup.followupId,
                        followup.samId,
                        followup.workerId,
                        followup.deadline_date.split('T')[0],
                        followup.completed_date,
                        followup.completed?1:0,
                        healthstatus.hsId,
                        healthstatus.height,
                        healthstatus.weight,
                        healthstatus.muac,
                        healthstatus.growthStatus,
                        healthstatus.otherSymptoms
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

    public static async fillFollowup(followupId:number, height:number, weight:number, muac:number, growthStatus:string, otherSymptoms:string){


        var l = new Date();
        l.setHours(l.getHours() + 5);
        l.setMinutes(l.getMinutes() + 30);
        

        await this.db.executeSql(`UPDATE followup
        SET completed_date = ?,
            completed=true,
            height = ?, 
            weight = ?,
            muac = ?, 
            growth_status = ?, 
            other_symptoms = ?
        WHERE followup_id = ?`,
        [
            l.toISOString().slice(0,-1),
            height,
            weight,
            muac,
            growthStatus,
            otherSymptoms,
            followupId
        ]);

    }

    public static async getWorkerDetails():Promise<WorkerProfile>{

        var result = await this.db.executeSql("SELECT * FROM worker_details", []);
        // aww_id integer PRIMARY KEY,
        // name string,
        // contact_number string,
        // aw_address string,
        // aw_location string
        result = result.rows.item(0);
        var details:WorkerProfile = {
            aww_id:result.aww_id,
            name:result.name,
            contact_number:result.contact_number,
            username:result.name,
            email:result.address,
            aw_address:result.aw_address,
            aw_location:result.aw_location
        };

        return details;
    

    }

    public static async updateWorker(details:WorkerProfile){

        await this.db.transaction((t) => {
            t.executeSql("DELETE FROM worker_details", []);
            t.executeSql("INSERT INTO worker_details values (?,?,?,?,?,?,?)", [
                details.aww_id,
                details.name,
                details.contact_number,
                details.username,
                details.email,
                details.aw_address,
                details.aw_location
            ]);
        });

    }
    

    static close(){
        this.db.close();
    }

    static reset(){
        SQLite.deleteDatabase({name: 'anganwaadiLocalDB.db', location: 'default'});
    }

    public static async getPatient(sam_id:number):Promise<patientDTO>{

        var result = await this.db.executeSql("SELECT * FROM patient WHERE sam_id = ?", [sam_id]);
        result = result.rows.item(0);

        var patient:patientDTO = {
            samId:result.sam_id,
            uhId:result.uh_id,
            rchId:result.rch_id,
            name:result.name,
            age:result.age,
            dob:result.dob,
            gender:result.gender,
            address:result.address,
            city:result.city,
            contactNumber:result.contact_number,
            relationshipStatus:result.relationship_status,
            caste:result.caste,
            religion:result.religion,
            bpl:result.bpl,
            referredBy:result.referred_by,
            last_updated:result.last_updated,
            followups: [],
            dischargeSummary: null
        };

        result = await this.db.executeSql("SELECT * FROM followup WHERE sam_id = ?", [sam_id]);

        const fCount = result.rows.length;

        for(var i = 0; i < fCount; i++){
            var followup = result.rows.item(i);
            patient.followups.push({
                followupId:followup.followup_id,
                workerId:followup.aww_id,
                deadline_date:followup.deadline_date,
                completed_date:followup.completed_date,
                completed:followup.completed,
                samId:followup.sam_id,
                createdDate:followup.created_date,
                healthStatus:{
                    hsId:followup.hs_id,
                    height:followup.height,
                    weight:followup.weight,
                    muac:followup.muac,
                    growthStatus:followup.growth_status,
                    otherSymptoms:followup.other_symptoms
                }
            });
        }

        return patient;

    }

    static async getLastSync():Promise<string>{
       
        var result = await this.db.executeSql("SELECT * FROM sync", []);
        result = result.rows.item(0);

        return result.last_sync;
    }

    static async updatePatients(patients: patientDTO[]){

        for(var i = 0; i < patients.length; i++) {

            var patient = patients[i];
            await this.insertFollowUps(patient.followups);
            console.log(patient);
            await this.db.executeSql("INSERT OR IGNORE INTO patient values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                patient.samId,
                patient.uhId,
                patient.rchId,
                patient.name,
                patient.age,
                patient.dob,
                patient.gender,
                patient.address,
                patient.city,
                patient.contactNumber,
                patient.relationshipStatus,
                patient.caste,
                patient.religion,
                patient.bpl,
                patient.referredBy,
                patient.last_updated,
                patient.dischargeSummary!.dischargeId
            ]);

            await this.db.executeSql(`
                UPDATE patient 
                SET discharge_id = ?
                WHERE sam_id = ?
            `, [patient.dischargeSummary!.dischargeId, patient.samId]);

            var discharge = patient.dischargeSummary!;
            console.log(discharge);
            await this.db.executeSql("INSERT INTO discharge_summary values (?,?,?,?,?,?,?,?,?)", [
                discharge.dischargeId,
                discharge.admissionDate,
                discharge.admissionWeight,
                discharge.targetWeight,
                discharge.dischargeDate,
                discharge.dischargeWeight,
                discharge.outcome,
                discharge.treatmentProtocol,
                patient.samId
            ]).catch((error) => console.log(error));
        };
        

    }

    static async test_populate(){

        var patient1:patientDTO = {
            samId: 1,
            uhId: "1",
            rchId: "1",
            name: "patient1_name",
            age: 6,
            dob: '2000-01-01',
            gender: 'male',
            address: 'somewhere',
            city: 'blore',
            contactNumber: '8888888888',
            relationshipStatus: 'single',
            caste: 'idk',
            religion: 'idk',
            bpl: 'true',
            referredBy: 'me',
            last_updated: '2022-01-01T10:20:20.000',
            followups: [],
            dischargeSummary: null
        };
        // this.insertPatients([patient1]);

        var followup1:FollowupDTO = {
            followupId: 1,
            workerId: 3,
            deadline_date: '2022-01-02',
            completed_date: '2022-01-02T01:00.000',
            completed: true,
            samId: 1,
            healthStatus: {
                hsId: 1,
                height: 60,
                weight: 18,
                muac: 12,
                growthStatus: 'regular',
                otherSymptoms: 'none'
            },
            createdDate: '2022-01-01'
        }

        var followup2:FollowupDTO = {
            followupId: 2,
            workerId: 3,
            deadline_date: '2022-01-05',
            completed_date: '2022-01-02T01:00.000',
            completed: true,
            samId: 1,
            healthStatus: {
                hsId: 2,
                height: 0,
                weight: 0,
                muac: 0,
                growthStatus: '',
                otherSymptoms: ''
            },
            createdDate: '2022-01-01'
        }

        var followup3:FollowupDTO = {
            followupId: 3,
            workerId: 3,
            deadline_date: '2022-01-06',
            completed_date: '',
            completed: false,
            samId: 1,
            healthStatus: {
                hsId: 2,
                height: 0,
                weight: 0,
                muac: 0,
                growthStatus: '',
                otherSymptoms: ''
            },
            createdDate: '2022-01-01'
        }

        var followup4:FollowupDTO = {
            followupId: 4,
            workerId: 3,
            deadline_date: '2022-01-06',
            completed_date: '',
            completed: false,
            samId: 1,
            healthStatus: {
                hsId: 2,
                height: 0,
                weight: 0,
                muac: 0,
                growthStatus: '',
                otherSymptoms: ''
            },
            createdDate: '2022-01-01'
        }

        var followup5:FollowupDTO = {
            followupId: 5,
            workerId: 3,
            deadline_date: '2022-01-07',
            completed_date: '',
            completed: false,
            samId: 1,
            healthStatus: {
                hsId: 2,
                height: 0,
                weight: 0,
                muac: 0,
                growthStatus: '',
                otherSymptoms: ''
            },
            createdDate: '2022-01-01'
        }

        var followup6:FollowupDTO = {
            followupId: 6,
            workerId: 3,
            deadline_date: '2022-01-09',
            completed_date: '',
            completed: false,
            samId: 1,
            healthStatus: {
                hsId: 2,
                height: 0,
                weight: 0,
                muac: 0,
                growthStatus: '',
                otherSymptoms: ''
            },
            createdDate: '2022-01-01'
        }

        var followup7:FollowupDTO = {
            followupId: 7,
            workerId: 3,
            deadline_date: '2022-01-22',
            completed_date: '',
            completed: false,
            samId: 1,
            healthStatus: {
                hsId: 2,
                height: 0,
                weight: 0,
                muac: 0,
                growthStatus: '',
                otherSymptoms: ''
            },
            createdDate: '2022-01-01'
        }

        // this.insertFollowUps([followup1, followup2, followup3, followup4, followup5, followup6, followup7]);

        var discharge1:Discharge = {
            dischargeId: 1,
            admissionDate: '2022-01-01',
            admissionWeight: 0,
            targetWeight: 0,
            dischargeDate: '2022-01-01',
            dischargeWeight: 0,
            outcome: 'good',
            treatmentProtocol: 'idk',
            samId: 1
        };

        var discharge2:Discharge = {
            dischargeId: 2,
            admissionDate: '2022-01-02',
            admissionWeight: 0,
            targetWeight: 0,
            dischargeDate: '2022-01-02',
            dischargeWeight: 10,
            outcome: 'bad',
            treatmentProtocol: 'idk2',
            samId: 1
        };

        // this.insertDischarge([discharge1, discharge2]);

        
        

    }

    
    
    static async test(){

        // await this.reset();
        await this.open();
        // await this.init();
        // await SyncClient.sync();

        var a = await this.checkLogin("tom", "pass");
        console.log(a);

        var b = await this.db.executeSql("Select * from login",[]);
        console.log(b.rows.item(0));
        
        // var a  = await this.getWorkerDetails();
        // console.log(a);

        // var a = await this.getLatestDischarge(4);
        // console.log(a);

        // var a = await this.db.executeSql(`select * from discharge_summary`,[]);

        // console.log(a.rows.item(0));

        // var a = await this.getLastSync();
        // console.log(a);

        // var b = await this.getFollowUps();
        // console.log(b);

        // var c = await this.getHomeScreenFollowUps("completed");
        // console.log(c); 

        // var a = await this.getLastUpdate([1,2]);
        // console.log(a);

        var b = await this.getNewFollowUps();
        console.log(b);

        // var a = await this.getHomeScreenFollowUps();
        // console.log(a);

        // var result = await this.db.executeSql("SELECT * FROM discharge_summary", []);
        // console.log(result.rows.item(0));
        // var a = await this.getLatestDischarge(1);
        // console.log(a);
        // await this.fillFollowup(1,60,35,80,"good","fever");

        // console.log(this.getPatient(1));

        // var result = await this.db.executeSql("select * from followup", []);
        // console.log(result.rows.item(0));
        // console.log(result.rows.item(1));

        
        // var result = await this.db.executeSql(`select * from patient`, []);
        // console.log(result.rows);

        // var result = await this.db.executeSql(`SELECT * FROM followup`, []);

        // var followupList:Followup[] = [];

        // // followupList.push({})

        // var size = result.rows.length;

        // for(var i = 0; i < size; i++){

        //     var row = result.rows.item(i);
        //     followupList.push({
        //         followupId:row.followup_id, 
        //         deadlineDate:row.deadline_date,
        //         completedDate: row.completed_date,
        //         hasCompleted: row.completed,
        //         patientId: row.sam_id
        //     });
        // }

        // console.log(followupList);

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

        // console.log(result.rows);


        
    }






}
