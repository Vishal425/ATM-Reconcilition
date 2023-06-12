import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsSwitchReconcilationComponent } from './cbs-switch-reconcilation.component';

describe('CbsSwitchReconcilationComponent', () => {
  let component: CbsSwitchReconcilationComponent;
  let fixture: ComponentFixture<CbsSwitchReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsSwitchReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsSwitchReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
