import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileNameConfigComponent } from './file-name-config.component';

describe('FileNameConfigComponent', () => {
  let component: FileNameConfigComponent;
  let fixture: ComponentFixture<FileNameConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileNameConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileNameConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
