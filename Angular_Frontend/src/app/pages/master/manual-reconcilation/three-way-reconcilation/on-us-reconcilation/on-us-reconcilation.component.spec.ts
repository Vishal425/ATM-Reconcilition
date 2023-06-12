import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnUsReconcilationComponent } from './on-us-reconcilation.component';

describe('OnUsReconcilationComponent', () => {
  let component: OnUsReconcilationComponent;
  let fixture: ComponentFixture<OnUsReconcilationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnUsReconcilationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnUsReconcilationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
