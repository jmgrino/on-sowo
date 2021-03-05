import { TestBed } from '@angular/core/testing';

import { OnsowersService } from './onsowers.service';

describe('OnsowersService', () => {
  let service: OnsowersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnsowersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
