import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchMasterComponent } from './switch-master.component';

describe('SwitchMasterComponent', () => {
  let component: SwitchMasterComponent;
  let fixture: ComponentFixture<SwitchMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
