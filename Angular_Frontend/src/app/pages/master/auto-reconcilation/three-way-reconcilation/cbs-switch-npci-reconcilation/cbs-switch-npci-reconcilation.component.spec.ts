import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsSwitchNpciReconcilationComponent } from './cbs-switch-npci-reconcilation.component';

describe('CbsSwitchNpciReconcilationComponent', () => {
  let component: CbsSwitchNpciReconcilationComponent;
  let fixture: ComponentFixture<CbsSwitchNpciReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsSwitchNpciReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsSwitchNpciReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
