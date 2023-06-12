import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReconcilationComponent } from './auto-reconcilation.component';

describe('AutoReconcilationComponent', () => {
  let component: AutoReconcilationComponent;
  let fixture: ComponentFixture<AutoReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
