import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataOrderComponent } from './user-data-order.component';

describe('UserDataOrderComponent', () => {
  let component: UserDataOrderComponent;
  let fixture: ComponentFixture<UserDataOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDataOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDataOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
