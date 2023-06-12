import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchFileUploadComponent } from './switch-file-upload.component';

describe('SwitchFileUploadComponent', () => {
  let component: SwitchFileUploadComponent;
  let fixture: ComponentFixture<SwitchFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
