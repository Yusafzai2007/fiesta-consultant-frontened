import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsDetilsComponent } from './cards-detils.component';

describe('CardsDetilsComponent', () => {
  let component: CardsDetilsComponent;
  let fixture: ComponentFixture<CardsDetilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsDetilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsDetilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
