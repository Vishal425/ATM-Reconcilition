import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedUnpostedEntriesComponent } from './posted-unposted-entries.component';

describe('PostedUnpostedEntriesComponent', () => {
  let component: PostedUnpostedEntriesComponent;
  let fixture: ComponentFixture<PostedUnpostedEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostedUnpostedEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostedUnpostedEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
