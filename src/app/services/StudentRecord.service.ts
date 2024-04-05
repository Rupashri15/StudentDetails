import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { StudentMarkRecord } from './StudentRecord.model';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentRecord  {

  url: string = environment.apiBaseUrl + '/StudentApiRecord'
  getUrl: string = environment.apiBaseUrl + '/getStudentId'
  
  arStudentDetails: StudentRecord[] = [];
  formData: StudentMarkRecord = new StudentMarkRecord();
  
  constructor(private http:HttpClient) { }

  district(){
    return [
      {
        id: 1,
        name: "Coimbatore"
      },
      {
        id: 2,
        name: "Chennai"
      },
      {
        id: 3,
        name: "Triuppur"
      }
    ]
  }

  taluk(){
    return [
      {
        id: 1,
        name: "Pollachi",
        districtId: 1
      },
      {
        id: 1,
        name: "Valparai",
        districtId: 1
      },
      {
        id: 1,
        name: "Sulur",
        districtId: 1
      },
      {
        id: 2,
        name: "Ambattur",
        districtId: 2
      },
      {
        id: 2,
        name: "Guindy",
        districtId: 2
      },
      {
        id: 2,
        name: "Ayanavaram",
        districtId: 2
      },
      {
        id: 3,
        name: "Dharapuram",
        districtId: 3
      },
      {
        id: 3,
        name: "Kangeyam",
        districtId: 3
      },
      {
        id: 3,
        name: "Avinashi",
        districtId: 3
      },

    ]
  }

  village(){
    return [
      {
        id: 1,
        name: "Nagoor",
        talukId: 1,
        districtId: 1 

      },
      {
        id: 1,
        name: "Ambarampalayam",
        talukId: 1, 
        districtId: 1 
      },
      {
        id: 1,
        name: "Gollapatti",
        talukId: 1, 
        districtId: 1 
      },
      {
        id: 1,
        name: "Chinnakallar",
        talukId: 2,
        districtId: 1 
      },
      {
        id: 1,
        name: "Akkamalai",
        talukId: 2,
        districtId: 1 
      },
      {
        id: 1,
        name: "Cinchona",
        talukId: 2,
        districtId: 1 
      },
      {
        id: 1,
        name: "Neelambur",
        talukId: 3,
        districtId: 1 
      },
      {
        id: 1,
        name: "Rasipalaiyam",
        talukId: 3,
        districtId: 1 
      },
      {
        id: 1,
        name: "Edayapalayam",
        talukId: 3,
        districtId: 1 
      },
      {
        id: 2,
        name: "Alathur",
        talukId: 4,
        districtId: 2 
      },
      {
        id: 2,
        name: "Kadavur",
        talukId: 4,
        districtId: 2
      },
      {
        id: 2,
        name: "Vellacheri",
        talukId: 4,
        districtId: 2
      },
      {
        id: 2,
        name: "Adayar",
        talukId: 5,
        districtId: 2
      },
      {
        id: 2,
        name: "T.Nagar",
        talukId: 5,
        districtId: 2
      },
      {
        id: 2,
        name: "Venkatapuram",
        talukId: 5,
        districtId: 2
      },
      {
        id: 2,
        name: "Kalathur",
        talukId: 6,
        districtId: 2
      },
      {
        id: 2,
        name: "Peruvallur",
        talukId: 6,
        districtId: 2
      },
      {
        id: 2,
        name: "Konnur",
        talukId: 6,
        districtId: 2
      },

      {
        id: 3,
        name: "Kolinjivadi",
        talukId: 7,
        districtId: 3
      },
      {
        id: 3,
        name: "Thoppampatti",
        talukId: 7,
        districtId: 3
      },
      {
        id: 3,
        name: "Nanjiyampalayam",
        talukId: 7,
        districtId: 3
      },
      {
        id: 3,
        name: "keeranur",
        talukId: 8,
        districtId: 3
      },
      {
        id: 3,
        name: "Uthiyur",
        talukId: 8,
        districtId: 3
      },
      {
        id: 3,
        name: "NathaKadaiyur",
        talukId: 8,
        districtId: 3
      },
      {
        id: 3,
        name: "Ayyampalayam",
        talukId: 9,
        districtId: 3
      },
      {
        id: 3,
        name: "Alathur",
        talukId: 9,
        districtId: 3
      },
      {
        id: 3,
        name: "Ganapathipalayam",
        talukId: 9,
        districtId: 3
      },

    ]
  }

  refreshList(){
    this.http.get(this.url)
    .subscribe({
      next: res=>{
        this.arStudentDetails = res as StudentRecord[]
      },
      error: err => {console.log(err)}
    })
  }

  postStudentRecord(requestData: any){
    return this.http.post(this.url,requestData)
  }

  getStudentId(){
    return this.http.get(this.getUrl)
  }
}
