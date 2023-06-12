import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsNpciReconcilationComponent } from './cbs-npci-reconcilation.component';

describe('CbsNpciReconcilationComponent', () => {
  let component: CbsNpciReconcilationComponent;
  let fixture: ComponentFixture<CbsNpciReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsNpciReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsNpciReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
