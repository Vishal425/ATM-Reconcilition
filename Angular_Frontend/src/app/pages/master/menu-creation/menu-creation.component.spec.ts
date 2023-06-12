import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCreationComponent } from './menu-creation.component';

describe('MenuCreationComponent', () => {
  let component: MenuCreationComponent;
  let fixture: ComponentFixture<MenuCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
