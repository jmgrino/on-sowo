import { TestBed } from '@angular/core/testing';

import { ActiveCampaignService } from './active-campaign.service';

describe('ActiveCampaignService', () => {
  let service: ActiveCampaignService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveCampaignService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
