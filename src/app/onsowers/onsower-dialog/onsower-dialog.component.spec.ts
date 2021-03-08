import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnsowerDialogComponent } from './onsower-dialog.component';

describe('OnsowerDialogComponent', () => {
  let component: OnsowerDialogComponent;
  let fixture: ComponentFixture<OnsowerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsowerDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnsowerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
