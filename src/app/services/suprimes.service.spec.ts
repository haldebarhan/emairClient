import { TestBed } from '@angular/core/testing';

import { SuprimesService } from './suprimes.service';

describe('SuprimesService', () => {
  let service: SuprimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuprimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
