import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefSystemComponent } from './ref-system.component';

describe('RefSystemComponent', () => {
  let component: RefSystemComponent;
  let fixture: ComponentFixture<RefSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
