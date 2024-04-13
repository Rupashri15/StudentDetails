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
import { HttpClient } from '@angular/common/http';
import { FailurePopupComponent } from '../failure-popup/failure-popup.component';




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
  studentService: any;
  students: any[] = [];
  filteredStudents: any[] = []; 
  searchQuery: string = '';
  postalPincodeInput: any;
  isSubmitted!: boolean;
  selectedDistrict: string = ''; 
  selectedTaluk: string = ''; 
  selectedVillage: string = '';


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


  constructor(public service: StudentRecord, private formBuilder: FormBuilder,private dialog: MatDialog, private http: HttpClient) {
    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => (this as any).updateErrorMessage()); 
  }
  
  districts: string[] = [];
  taluks: any[] = [];
  villages: any[] = [];

  ngOnInit(): void {
   this.getDistrictValues();
    this.fetchStudents();

  }
  getDistrictValues() {
    this.service.getDistrict().subscribe({
      next: (res: any) => {
         console.log("District values ", res)
         this.districts = res;
      },
      error: err => {
         console.log(err);
      }
  });
  }

  onDistrictChange(district: string) {
    console.log("Selected district ", district);
    if(district){
      this.service.getTaluksByDistrict(district).subscribe({
        next: (res: any) => {
          console.log("Taluks for selected district ", district, ":", res);
          this.taluks = res;
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  

  onTalukChange(taluk: string) {
    console.log("Selected taluk ", taluk);
    this.service.getVillagesByTaluk(taluk).subscribe({
      next: (res: any) => {
        console.log("Villages for taluk ", taluk, ":", res);
        this.villages = res;
      },
      error: err => {
        console.log(err);
      }
    });
  }

  
  
  calculateTotalAndAverage() {
    this.tamil = parseFloat(this.tamil.toString()) || 0;
    this.english = parseFloat(this.english.toString()) || 0;
    this.maths = parseFloat(this.maths.toString()) || 0;
    this.science = parseFloat(this.science.toString()) || 0;
    this.social = parseFloat(this.social.toString()) || 0;

    const marksArray = [this.tamil, this.english, this.maths, this.science, this.social];
    const isAnyFail = marksArray.some(mark => mark < 35);

    this.totalMarks = marksArray.reduce((total, mark) => total + mark, 0);
    this.average = this.totalMarks / 5;

    if (isAnyFail) {
        this.result = 'Fail';
    } else {
        this.result = this.average >= 40 ? 'Pass' : 'Fail'; 
    }
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


  onSubmitMarks(form: NgForm) {
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
        district: this.selectedDistrict || '', 
        taluk: this.selectedTaluk || '', 
        village: form.value.village || '',
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
          this.isSubmitted= true;
          console.log("Result of the student record ", res);
        },
        error: err => {
          this.isSubmitted= false;
          console.log(err);
        }
      });
     

    }
    else
    {
        console.log("is not a valid form");
    }
   this.openSuccessPopup(form.value.name, form.value.contactNumber, this.isSubmitted);
  }
  

async openSuccessPopup(name: string, contactNumber: string, isSubmitted: boolean): Promise<void> {
  console.log("popup: ", name, contactNumber, isSubmitted);
 // if(isSubmitted){
  try {
      const acknowledgmentNumber = await this.generateAcknowledgmentNumber(name, contactNumber);
      
      const dialogRef = this.dialog.open(SuccessPopupComponent, {
          width: '400px',
          data: { acknowledgmentNumber } // Pass acknowledgment number to the dialog
      });

      // handle dialog close event
      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
      });
  } catch (error) {
      console.error('Error occurred while generating acknowledgment number:', error);
      // Handle error appropriately, such as displaying an error message to the user
  }
// }
// else{
//   const dialogRef = this.dialog.open(FailurePopupComponent, {
//     width: '400px',
//    // Pass acknowledgment number to the dialog
// });
// }
}

generateAcknowledgmentNumber(name: string, contactNumber: string): Promise<string> {
  return new Promise((resolve, reject) => {
      this.service.getStudentId().subscribe({
          next: (res: any) => {
              if (typeof res === 'number') {
                  const nameAbbreviation = name.substring(0, 3).toUpperCase();
                  const middleDigits = contactNumber.substr(3, 3);
                  let nextAckNumber: number = res +1;
                  const acknowledgmentNumber = `${nameAbbreviation}${middleDigits}${nextAckNumber}`;
                  
                  console.log("Acknowledgment Number:", acknowledgmentNumber);
                  resolve(acknowledgmentNumber); 
              } else {
                  console.error("Error: Student ID is not a number.");
                  reject("Error: Student ID is not a number."); 
              }
          },
          error: err => {
              console.error("Error occurred while fetching student ID:", err);
              reject(err); 
          }
      });
  });
}

 // Define students array with some sample data
  public displayedColumns: string[] = ['studentId', 'name', 'contactNumber', 'district', 'taluk', 'village', 'action'];

  public dataSource: any = [];
  
 
  fetchStudents(): void {
    this.studentService.getStudents().subscribe(
      (data: any) => {
        this.students = data;
        this.filteredStudents = [...this.students];
      }, 
      (error: any) => {
        console.error('Error fetching students:', error);
      }
    );
  }
  
  applyFilter(): void {
    console.log("Search query ", this.searchQuery);
    if(this.searchQuery){
    this.service.getStudentRecordContact(this.searchQuery).subscribe(
      (data: any) => {
        this.students = data;
        this.filteredStudents = [...this.students];
      }, 
      (error: any) => {
        console.error('Error fetching students:', error);
      }
    );
    

  }
  else {
    this.filteredStudents = []; 
  }
  }


  clearSearch(): void {
    this.searchQuery = ''; 
    this.applyFilter(); 
  }


editStudent(student: any) {
  console.log('Editing student:', student);
}


deleteStudent(student: any) {
  console.log('Deleting student:', student);
}

}
