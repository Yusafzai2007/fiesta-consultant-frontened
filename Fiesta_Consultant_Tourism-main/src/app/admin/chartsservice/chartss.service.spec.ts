import { TestBed } from '@angular/core/testing';

import { ChartssService } from './chartss.service';

describe('ChartssService', () => {
  let service: ChartssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
