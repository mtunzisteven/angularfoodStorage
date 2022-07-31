import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovedProductsComponent } from './removed-products.component';

describe('RemovedProductsComponent', () => {
  let component: RemovedProductsComponent;
  let fixture: ComponentFixture<RemovedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemovedProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
