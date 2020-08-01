import { TestBed } from '@angular/core/testing';

import { MultiUserService } from './multi-user.service';

describe('MultiUserService', () => {
  let service: MultiUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
