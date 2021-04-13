import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PartnershipsPage } from './partnerships.page';

describe('PartnershipsPage', () => {
  let component: PartnershipsPage;
  let fixture: ComponentFixture<PartnershipsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnershipsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PartnershipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
