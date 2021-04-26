import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

// import * as _moment from 'moment';
// import { Moment } from 'moment';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl, FormGroup } from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';


// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

interface CalendarDay {
  order: number;
  day: number;
  dayInMonth: boolean;
}

interface OsEvent {
  name: string;
  date: moment.Moment;
}

const DAYS_IN_CALENDAR = 42;

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EventsPage implements OnInit {
  user: User;
  osEvents: OsEvent[];
  // today: Date;
  // day: number; // 0 (sunday) to 6 (saturday)
  // year: number;
  // month: number; // 0 (january) to 11 (december)
  // firstDay: number;
  // daysInMonth: number;
  // calendarDays: CalendarDay[];
  calendarDays: any[];
  monthName: string;
  // iniDate: Date = new Date(2021,1,1);
  iniDate: moment.Moment;
  pickerForm: FormGroup;
  displayForm: FormGroup;
  isSmallScreen: boolean;


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {

    this.breakpointObserver.observe([
      '(max-width: 576px)'
      ])
      .subscribe( result => {
        if (result.matches) {
          this.isSmallScreen = true;
          this.displayForm.setValue({displayControl: 'schedule'})
        } else {
          // if necessary:
          this.isSmallScreen = false;
        }
      })





    this.osEvents = [
      {
        name: 'Evento 1',
        date: moment([2021, 3, 28]),
      },
      {
        name: 'Evento 2',
        date: moment([2021, 3, 30]),
      },
      {
        name: 'Evento 0',
        date: moment([2021, 3, 1]),
      },
      {
        name: 'Evento 3',
        date: moment([2021, 4, 1]),
      },
    ]


    moment.locale('es');
    this.iniDate = moment();
    this.iniDate.set('date', 1);

    this.initCalendar(this.iniDate);


    this.pickerForm = new FormGroup({
      date: new FormControl(this.iniDate),
    });

    if (this.isSmallScreen) {
      this.displayForm = new FormGroup({
        displayControl: new FormControl('schedule'),
      });

    } else {
      this.displayForm = new FormGroup({
        displayControl: new FormControl('month'),
      });

    }



    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
      }
    });

  }

  ionViewWillEnter(event) {
    this.sidemenu.enable(true);
  }


  chosenYearHandler(normalizedYear: moment.Moment) {
    const ctrlValue: moment.Moment = this.pickerForm.value.date;
    ctrlValue.year(normalizedYear.year());
    this.pickerForm.setValue({date: ctrlValue});
  }


  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue: moment.Moment = this.pickerForm.value.date;
    ctrlValue.month(normalizedMonth.month());
    this.pickerForm.setValue({date: ctrlValue})
    this.initCalendar(ctrlValue);
    datepicker.close();
  }

  onPreviousMonth() {
    const ctrlValue: moment.Moment = this.pickerForm.value.date;
    ctrlValue.subtract(1, 'months');
    this.pickerForm.setValue({date: ctrlValue})
    this.initCalendar(ctrlValue);
  }

  onNextMonth() {
    const ctrlValue: moment.Moment = this.pickerForm.value.date;
    ctrlValue.add(1, 'months');
    this.pickerForm.setValue({date: ctrlValue})
    this.initCalendar(ctrlValue);
  }

  onChangeDate(event) {
    const ctrlValue: moment.Moment = this.pickerForm.value.date;
    console.log(event);
    console.log('CHANGE', this.pickerForm.value.date);
    this.initCalendar(ctrlValue);

  }

  initCalendar(calDate: moment.Moment) {
    // To be sure that is first of month (should be)
    calDate.set('date', 1);

    this.monthName = calDate.format('MMMM - YYYY').toLocaleUpperCase();

    const month = calDate.month();
    const year = calDate.year();

    // get the first day of the month. this is an enumerated index, so 1 is Monday and 7 is Sunday.
    const firstDay = calDate.isoWeekday();
    const firstCalendarDay = calDate.clone().subtract(firstDay - 1, 'days');
    const lastCalendarDay = firstCalendarDay.clone().add(DAYS_IN_CALENDAR, 'days');
    const firstMonthDay = calDate.clone();
    const lastMonthDay =  calDate.clone().endOf('month');


    const daysInMonth = calDate.clone().endOf('month').date();


    this.calendarDays = [];

    let displayDate = firstCalendarDay.clone();
    let dayInMonth = false;

    calcular DAYS_IN_CALENDA depenent del mes per evitar la última setmana buida

    for (let i = 1; i <= DAYS_IN_CALENDAR; i++) {


      this.calendarDays.push({
        order: i,
        day: displayDate.date(),
        dayInMonth: displayDate.isSame(calDate, 'month'),
        // items: [
        //   {
        //   name: 'Item 1',
        //   },
        //   {
        //   name: 'Item 2',
        //   },
        // ]
      })
      displayDate.add(1, 'days');

    }

    for (const osEvent of this.osEvents) {
      console.log(osEvent.name, osEvent.date.diff(firstCalendarDay, 'days'));

      const index = osEvent.date.diff(firstCalendarDay, 'days') + 1;

      if (index > 0 && index < DAYS_IN_CALENDAR) {
        this.calendarDays[index].items = [{
          name: osEvent.name + ' (' + osEvent.date.format('DD') + ')',
        }];
      }




    }

    console.log(this.calendarDays);



  }


  onDisplayToggle(event) {
    console.log(event);

  }

}
