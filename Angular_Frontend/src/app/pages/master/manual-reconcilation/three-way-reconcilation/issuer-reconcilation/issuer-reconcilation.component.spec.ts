import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerReconcilationComponent } from './issuer-reconcilation.component';

describe('IssuerReconcilationComponent', () => {
  let component: IssuerReconcilationComponent;
  let fixture: ComponentFixture<IssuerReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuerReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
