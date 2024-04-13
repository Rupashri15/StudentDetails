import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailurePopupComponent } from './failure-popup.component';

describe('SuccessPopupComponent', () => {
  let component: FailurePopupComponent;
  let fixture: ComponentFixture<FailurePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FailurePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FailurePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
