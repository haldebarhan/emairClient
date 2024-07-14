import { TestBed } from '@angular/core/testing';

import { ConsoService } from './conso.service';

describe('ConsoService', () => {
  let service: ConsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
