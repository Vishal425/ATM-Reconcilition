import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosEcomRefundFileComponent } from './pos-ecom-refund-file.component';

describe('PosEcomRefundFileComponent', () => {
  let component: PosEcomRefundFileComponent;
  let fixture: ComponentFixture<PosEcomRefundFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosEcomRefundFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosEcomRefundFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
