import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NPCIFileUploadComponent } from './npcifile-upload.component';

describe('NPCIFileUploadComponent', () => {
  let component: NPCIFileUploadComponent;
  let fixture: ComponentFixture<NPCIFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NPCIFileUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NPCIFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
