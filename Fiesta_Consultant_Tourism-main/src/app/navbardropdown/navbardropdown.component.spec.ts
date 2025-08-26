import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbardropdownComponent } from './navbardropdown.component';

describe('NavbardropdownComponent', () => {
  let component: NavbardropdownComponent;
  let fixture: ComponentFixture<NavbardropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbardropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbardropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
