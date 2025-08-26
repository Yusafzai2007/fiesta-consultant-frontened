import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllComComponent } from './all-com.component';

describe('AllComComponent', () => {
  let component: AllComComponent;
  let fixture: ComponentFixture<AllComComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllComComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
