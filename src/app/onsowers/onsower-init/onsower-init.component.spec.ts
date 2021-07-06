import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnsowerInitComponent } from './onsower-init.component';

describe('OnsowerInitComponent', () => {
  let component: OnsowerInitComponent;
  let fixture: ComponentFixture<OnsowerInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsowerInitComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnsowerInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
