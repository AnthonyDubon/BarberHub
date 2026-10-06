import { TestBed } from '@angular/core/testing';

import { AdminAppointments } from './admin-appointments';

describe('AdminAppointments', () => {
  let service: AdminAppointments;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAppointments);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
