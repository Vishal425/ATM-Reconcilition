import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualReconcilationComponent } from './manual-reconcilation.component';

describe('ManualReconcilationComponent', () => {
  let component: ManualReconcilationComponent;
  let fixture: ComponentFixture<ManualReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
