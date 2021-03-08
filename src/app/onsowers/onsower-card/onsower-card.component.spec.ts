import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnsowerCardComponent } from './onsower-card.component';

describe('OnsowerCardComponent', () => {
  let component: OnsowerCardComponent;
  let fixture: ComponentFixture<OnsowerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsowerCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnsowerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
