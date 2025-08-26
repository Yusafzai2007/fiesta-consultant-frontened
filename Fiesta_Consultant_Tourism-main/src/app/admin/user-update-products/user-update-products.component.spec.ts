import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateProductsComponent } from './user-update-products.component';

describe('UserUpdateProductsComponent', () => {
  let component: UserUpdateProductsComponent;
  let fixture: ComponentFixture<UserUpdateProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpdateProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpdateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
