import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredGroupAComponent } from './expired-group-a.component';

describe('ExpiredGroupAComponent', () => {
  let component: ExpiredGroupAComponent;
  let fixture: ComponentFixture<ExpiredGroupAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredGroupAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredGroupAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
