import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MastermindPage } from './mastermind.page';

describe('MastermindPage', () => {
  let component: MastermindPage;
  let fixture: ComponentFixture<MastermindPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MastermindPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MastermindPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
