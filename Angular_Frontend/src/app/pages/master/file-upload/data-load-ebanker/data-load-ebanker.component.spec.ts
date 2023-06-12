import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataLoadEbankerComponent } from './data-load-ebanker.component';

describe('DataLoadEbankerComponent', () => {
  let component: DataLoadEbankerComponent;
  let fixture: ComponentFixture<DataLoadEbankerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataLoadEbankerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataLoadEbankerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
