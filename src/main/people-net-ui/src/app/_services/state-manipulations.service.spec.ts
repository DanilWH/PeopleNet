import { TestBed } from '@angular/core/testing';

import { StateManipulationsService } from './state-manipulations.service';

describe('StateManipulationsService', () => {
  let service: StateManipulationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateManipulationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
