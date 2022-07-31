import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredGroupBComponent } from './expired-group-b.component';

describe('ExpiredGroupBComponent', () => {
  let component: ExpiredGroupBComponent;
  let fixture: ComponentFixture<ExpiredGroupBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredGroupBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredGroupBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
