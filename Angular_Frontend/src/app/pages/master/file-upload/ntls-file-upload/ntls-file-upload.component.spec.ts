import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtlsFileUploadComponent } from './ntls-file-upload.component';

describe('NtlsFileUploadComponent', () => {
  let component: NtlsFileUploadComponent;
  let fixture: ComponentFixture<NtlsFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtlsFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NtlsFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
