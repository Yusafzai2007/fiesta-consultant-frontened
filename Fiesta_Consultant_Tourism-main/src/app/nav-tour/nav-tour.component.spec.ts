import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTourComponent } from './nav-tour.component';

describe('NavTourComponent', () => {
  let component: NavTourComponent;
  let fixture: ComponentFixture<NavTourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavTourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
