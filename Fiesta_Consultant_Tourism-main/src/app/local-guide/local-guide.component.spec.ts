import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalGuideComponent } from './local-guide.component';

describe('LocalGuideComponent', () => {
  let component: LocalGuideComponent;
  let fixture: ComponentFixture<LocalGuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalGuideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
