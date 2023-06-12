import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsFileUploadComponent } from './cbs-file-upload.component';

describe('CbsFileUploadComponent', () => {
  let component: CbsFileUploadComponent;
  let fixture: ComponentFixture<CbsFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
