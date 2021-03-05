import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnsowersPage } from './onsowers.page';

describe('OnsowersPage', () => {
  let component: OnsowersPage;
  let fixture: ComponentFixture<OnsowersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsowersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnsowersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
