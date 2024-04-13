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
  getDistrictUrl: string =  environment.apiBaseUrl + '/getDistrict'
  getTalukUrl: string = environment.apiBaseUrl +  '/StudentApiRecord/Taluk'
  getVillageUrl: string = environment.apiBaseUrl +  '/StudentApiRecord/Village'
  contactNumberUrl: string | undefined;
  
  arStudentDetails: StudentRecord[] = [];
  formData: StudentMarkRecord = new StudentMarkRecord();
  private apiUrl = environment.apiBaseUrl;
  
  constructor(private http:HttpClient) { }

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

  getStudentRecordContact(contactNumber: any){
    this.contactNumberUrl = this.url + "/"+contactNumber;

    return this.http.get(this.contactNumberUrl);
  }

  getDistrict(){
    return this.http.get(this.getDistrictUrl)
  }

  getTaluksByDistrict(district: any){
    const url = this.getTalukUrl + "/"+ district;
    console.log(this.getTalukUrl);
    return this.http.get(url);
  }

  getVillagesByTaluk(taluk: string){
    const url = this.getVillageUrl + "/"+ taluk;
    console.log(this.getVillageUrl);
    return this.http.get(url);
  }

  getStudentId(){
    return this.http.get(this.getUrl)
  }
}
