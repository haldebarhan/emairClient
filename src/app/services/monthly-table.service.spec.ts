import { TestBed } from '@angular/core/testing';

import { MonthlyTableService } from './monthly-table.service';

describe('MonthlyTableService', () => {
  let service: MonthlyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonthlyTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
