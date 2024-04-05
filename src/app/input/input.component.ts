import { Component, OnInit } from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, NgForm} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Observable, merge, of} from 'rxjs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { StudentRecord } from '../services/StudentRecord.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SuccessPopupComponent } from '../success-popup/success-popup.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  
})

export class InputComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  dob!: Date;
  age: number | null = null;
  errorMessage = '';
  tamil!: number;
  english!: number;
  maths!: number;
  science!: number;
  social!: number;
  totalMarks: number | null = null;
  average: number | null = null;
  result!: string;
  latestStudentId: any;
  emailValue: any;
  tamilValue: any;
  InputComponent: any;
  taluk!: { id: number; name: string; }[];
  name: any;
  contactNumber: any;

  
  

  calculateAge(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.dob = event.value;
      const today = new Date();
      const birthDate = new Date(this.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.age = age;
    }
  }


  constructor(public service: StudentRecord, private formBuilder: FormBuilder,private dialog: MatDialog) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
   .subscribe(() => (this as any).updateErrorMessage()); 
  }

  

  //district:any=[];
  //selectedTalukOptions: any[] = [];
  //selectedVillageOptions: any[] = [];

  //onSelect(district: any){
    //console.log(district.target.value);
    //this.taluk = this.service.taluk().filter(e=> e.id == district.target.value);
    //console.log(this.taluk);
  //}

  districts: any[] = [];
  selectedTalukOptions: any[] = [];
  selectedVillageOptions: any[] = [];

  ngOnInit(): void {
    //this.service.refreshList();
    this.districts = this.service.district();
    console.log(this.districts);
  }

  onSelectDistrict(event: any){
    console.log("district value", event.target.value);
    const selectedDistrictId = event.target.value;
    this.selectedTalukOptions = this.service.taluk().filter(taluk => taluk.districtId == selectedDistrictId);
    this.selectedVillageOptions = [];
  }

  onSelectTaluk(event: any): void {
    const selectedTalukId = event.target.value;
    const selectedDistrictId = this.selectedDistrictId;
    this.selectedVillageOptions = this.service.village().filter(village => village.talukId == selectedTalukId && village.districtId == selectedDistrictId);
  }

  get selectedDistrictId(): any {
    return this.selectedTalukOptions.length > 0 ? this.selectedTalukOptions[0].districtId : null;
  }

  
  calculateTotalAndAverage() {
    this.tamil = parseFloat(this.tamil.toString()) || 0;
    this.english = parseFloat(this.english.toString()) || 0;
    this.maths = parseFloat(this.maths.toString()) || 0;
    this.science = parseFloat(this.science.toString()) || 0;
    this.social = parseFloat(this.social.toString()) || 0;

    this.totalMarks = this.tamil + this.english + this.maths + this.science + this.social;
    this.average = this.totalMarks / 5; 
      
    this.result = this.average >= 40 ? 'Pass' : 'Fail'; 
  }
     


  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }


  onSubmit(form: NgForm) {
    if (form.valid) {

      this.calculateTotalAndAverage();
      const formData = form.value; 
      console.log("FormData ", form.value); 
      console.log("Age in formData", formData.age);
      const request = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age,
        email: formData.email,
        contactNumber: formData.contactNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        district: formData.district,
        taluk: formData.taluk,
        village: formData.village,
        postalPincode: formData.postalPincode,
        tamil: formData.tamil,
        english: formData.english,
        maths: formData.maths,
        science: formData.science,
        social: formData.social,
        totalMarks: this.totalMarks, 
        average: this.average, 
        result: this.result

      };
      console.log("Request data ", request);
      this.service.postStudentRecord(request).subscribe({
        next: res => {
          console.log("Result of the student record ", res);
        },
        error: err => {
          console.log(err);
        }
      });
     

    }
    else
    {

    }
   // this.openSuccessPopup();
  }
  
//   openSuccessPopup(name: string, contactNumber: string): void {
//   console.log("popup: ", name,contactNumber);
//   const acknowledgmentNumber = this.generateAcknowledgmentNumber(name, contactNumber);
//   const dialogRef = this.dialog.open(SuccessPopupComponent, {
//   width: '400px',
//   data: { acknowledgmentNumber } // Pass acknowledgment number to the dialog
//   });

//     // Optionally, handle dialog close event
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//     });
//   }

//   generateAcknowledgmentNumber(name: string, contactNumber: string) {
//     this.service.getStudentId().subscribe({
//         next: (res: any) => {
//             if (typeof res === 'number') { // Check if 'res' is already a number
//                 const nameAbbreviation = name.substring(0, 3).toUpperCase();
//                 const middleDigits = contactNumber.substr(3, 3);
//                 let nextAckNumber: number = res; // Assign 'res' to 'nextAckNumber'
//                 const acknowledgmentNumber = `${nameAbbreviation}${middleDigits}${nextAckNumber}`;
//                 nextAckNumber++; // Increment the auto increment number for the next submission
                
//                 console.log("Acknowledgment Number:", acknowledgmentNumber);
//                 return acknowledgmentNumber;
//             } else {
//                 console.error("Error: Student ID is not a number.");
//                 return null; // Return null or handle error case appropriately
//             }
//         },
//         error: err => {
//             console.log(err);
//         }
//     });
// }

async openSuccessPopup(name: string, contactNumber: string): Promise<void> {
  console.log("popup: ", name, contactNumber);
  
  try {
      const acknowledgmentNumber = await this.generateAcknowledgmentNumber(name, contactNumber);
      
      const dialogRef = this.dialog.open(SuccessPopupComponent, {
          width: '400px',
          data: { acknowledgmentNumber } // Pass acknowledgment number to the dialog
      });

      // Optionally, handle dialog close event
      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
      });
  } catch (error) {
      console.error('Error occurred while generating acknowledgment number:', error);
      // Handle error appropriately, such as displaying an error message to the user
  }
}

generateAcknowledgmentNumber(name: string, contactNumber: string): Promise<string> {
  return new Promise((resolve, reject) => {
      this.service.getStudentId().subscribe({
          next: (res: any) => {
              if (typeof res === 'number') {
                  const nameAbbreviation = name.substring(0, 3).toUpperCase();
                  const middleDigits = contactNumber.substr(3, 3);
                  let nextAckNumber: number = res;
                  const acknowledgmentNumber = `${nameAbbreviation}${middleDigits}${nextAckNumber}`;
                  nextAckNumber++;
                  
                  console.log("Acknowledgment Number:", acknowledgmentNumber);
                  resolve(acknowledgmentNumber); // Resolve with acknowledgment number
              } else {
                  console.error("Error: Student ID is not a number.");
                  reject("Error: Student ID is not a number."); // Reject with error message
              }
          },
          error: err => {
              console.error("Error occurred while fetching student ID:", err);
              reject(err); // Reject with error object
          }
      });
  });
}


}
