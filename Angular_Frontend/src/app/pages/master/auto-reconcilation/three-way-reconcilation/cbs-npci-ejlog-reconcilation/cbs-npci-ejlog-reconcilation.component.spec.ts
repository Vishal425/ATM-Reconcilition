import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbsNpciEjlogReconcilationComponent } from './cbs-npci-ejlog-reconcilation.component';

describe('CbsNpciEilogReconcilationComponent', () => {
  let component: CbsNpciEjlogReconcilationComponent;
  let fixture: ComponentFixture<CbsNpciEjlogReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CbsNpciEjlogReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CbsNpciEjlogReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
