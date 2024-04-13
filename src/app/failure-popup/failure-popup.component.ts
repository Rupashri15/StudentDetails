import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-failure-popup',
  templateUrl: './failure-popup.component.html',
  styleUrl: './failure-popup.component.css'
})
export class FailurePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<FailurePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
