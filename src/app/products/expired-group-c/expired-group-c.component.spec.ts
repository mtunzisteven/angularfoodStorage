import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredGroupCComponent } from './expired-group-c.component';

describe('ExpiredGroupCComponent', () => {
  let component: ExpiredGroupCComponent;
  let fixture: ComponentFixture<ExpiredGroupCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredGroupCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredGroupCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
