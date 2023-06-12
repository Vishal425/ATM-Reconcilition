import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileFormatConfigurationComponent } from './file-format-configuration.component';

describe('FileFormatConfigurationComponent', () => {
  let component: FileFormatConfigurationComponent;
  let fixture: ComponentFixture<FileFormatConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileFormatConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileFormatConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
