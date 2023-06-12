import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpostedTransactionPostingComponent } from './unposted-transaction-posting.component';

describe('UnpostedTransactionPostingComponent', () => {
  let component: UnpostedTransactionPostingComponent;
  let fixture: ComponentFixture<UnpostedTransactionPostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpostedTransactionPostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpostedTransactionPostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
