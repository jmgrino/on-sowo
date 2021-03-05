import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnsowerComponent } from './onsower.component';

describe('OnsowerComponent', () => {
  let component: OnsowerComponent;
  let fixture: ComponentFixture<OnsowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsowerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnsowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
