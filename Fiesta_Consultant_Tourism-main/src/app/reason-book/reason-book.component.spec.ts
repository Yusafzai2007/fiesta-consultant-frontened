import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonBookComponent } from './reason-book.component';

describe('ReasonBookComponent', () => {
  let component: ReasonBookComponent;
  let fixture: ComponentFixture<ReasonBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReasonBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReasonBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
