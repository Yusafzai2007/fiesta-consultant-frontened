import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAboutusComponent } from './nav-aboutus.component';

describe('NavAboutusComponent', () => {
  let component: NavAboutusComponent;
  let fixture: ComponentFixture<NavAboutusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAboutusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavAboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
