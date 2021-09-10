import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { OsEvent } from './event.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UIService } from '../shared/ui.service';
import { EventsService } from './events.service';
import { EditDialogComponent } from '../shared/edit-dialog/edit-dialog.component';
// import 'firebase/firestore';
// import * as firebase from 'firebase';
import firebase from 'firebase/app';
import { EventDialogComponent } from './event-dialog/event-dialog.component';
import { finalize, take } from 'rxjs/operators';
// import 'firebase/firestore';


// tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

// const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

const MY_FORMATS = {
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

const DAYS_IN_CALENDAR = 42;
const LAST_ROW_START = 36;

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
export class EventsPage implements OnInit, OnDestroy {
  user: User;
  osEvents: OsEvent[];
  orderedEvents: OsEvent[];
  calendarDays: any[];
  agendaDays: any[];
  monthName: string;
  iniDate: moment.Moment;
  today: moment.Moment;
  pickerForm: FormGroup;
  displayForm: FormGroup;
  isSmallScreen: boolean;
  thisYear: String;
  eventsSubscription: Subscription;


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private uiService: UIService,
    private eventsService: EventsService,
    private dataService: DataService
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

    moment.locale('es');
    this.today = moment();
    this.today.set({hour:0,minute:0,second:0,millisecond:0});
    this.iniDate = moment();
    this.iniDate.set({date:1, hour:0,minute:0,second:0,millisecond:0});

    // this.initCalendar(this.iniDate);


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

        this.eventsSubscription = this.eventsService.fetchEvents().subscribe( events => {
          this.osEvents = events;
          for (const event of events) {
            if (event) {
              if (!event.date) {
                const created = firebase.firestore.Timestamp.fromDate(new Date(this.today.toDate()));
                event.date = created;
                this.eventsService.saveEvent(event.id, {
                  date: created,
                }).subscribe();
              }
            }
          }

          let diff: number;
          this.osEvents.sort( ( a, b ) => {
            diff = a.date.seconds - b.date.seconds;

            if ( diff > 0 ) {
              return 1
            } else if ( diff < 0 ) {
              return -1
            } else {
              if (a.hour > b.hour) {
                return 1
              } else if (a.hour < b.hour) {
                return -1
              } else {
                return 0
              }
            }

          });

          this.initCalendar(this.iniDate);

        });

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
    this.initCalendar(ctrlValue);

  }

  initCalendar(calDate: moment.Moment) {
    // To be sure that is first of month (should be)
    calDate.set('date', 1);

    this.monthName = calDate.format('MMMM - YYYY').toLocaleUpperCase();

    // const month = calDate.month();
    // const year = calDate.year();

    // get the first day of the month. this is an enumerated index, so 1 is Monday and 7 is Sunday.
    const firstDay = calDate.isoWeekday();
    const firstCalendarDay = calDate.clone().subtract(firstDay - 1, 'days');



    this.calendarDays = [];

    let displayDate = firstCalendarDay.clone();

    // calcular DAYS_IN_CALENDA depenent del mes per evitar la última setmana buida

    for (let i = 1; i <= DAYS_IN_CALENDAR; i++) {

      if ( i == LAST_ROW_START && !displayDate.isSame(calDate, 'month') ) { break; }


      this.calendarDays.push({
        index: i,
        day: displayDate.date(),
        dayInMonth: displayDate.isSame(calDate, 'month'),
        isToday: displayDate.isSame(this.today, 'day'),
        items: [],
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

    let osEventDate: moment.Moment;
    for (const osEvent of this.osEvents) {
      // osEventDate = osEvent.date.clone().set({hour:0,minute:0,second:0,millisecond:0});
      osEventDate = moment(osEvent.date.toDate()).clone().set({hour:0,minute:0,second:0,millisecond:0});

      const index = osEventDate.diff(firstCalendarDay, 'days');

      if (index >= 0 && index < DAYS_IN_CALENDAR) {
        this.calendarDays[index].items.push(
          {
            id: osEvent.id,
            // name: osEvent.name + ' (' + osEvent.date.format('DD') + ')',
            hour: osEvent.hour,
            name:  osEvent.name,
          }
        );
      }

    }

    this.agendaDays = [];
    // let agendaDay: any;
    let agendaMonth: string;
    let agendaYear: string;

    moment.locale('es');

    let yearIndex: number;
    let monthIndex: number;
    let osAgendaEventDate: moment.Moment;
    this.thisYear = this.today.year().toString();

    for (const osEvent of this.osEvents) {
      agendaYear = moment(osEvent.date.toDate()).year().toString();
      agendaMonth = moment(osEvent.date.toDate()).locale('es').format("MMMM");
      agendaMonth = agendaMonth.charAt(0).toUpperCase() + agendaMonth.slice(1);

      osAgendaEventDate = moment(osEvent.date.toDate()).clone().set({hour:0,minute:0,second:0,millisecond:0});
      if (osAgendaEventDate.diff(this.today, 'days') < 0) {continue;}


      yearIndex = -1
      for (let i = 0; i < this.agendaDays.length; i++) {
        if (this.agendaDays[i].year == agendaYear) {
          yearIndex = i;
          break;
        }
      }

      if (yearIndex == -1) {
        // Create year
        this.agendaDays.push({
          year: agendaYear,
          months: []
        });
        yearIndex = this.agendaDays.length -1;
      }

      monthIndex = -1;
      for (let i = 0; i < this.agendaDays[yearIndex].months.length; i++) {
        if (this.agendaDays[yearIndex].months[i].month == agendaMonth) {
          monthIndex = i;
          break;
        }
      }

      if (monthIndex == -1) {
        // Create month
        this.agendaDays[yearIndex].months.push({
          month: agendaMonth,
          events: []
        });
        monthIndex = this.agendaDays[yearIndex].months.length -1;
      }

      this.agendaDays[yearIndex].months[monthIndex].events.push({...osEvent, date: moment(osEvent.date.toDate())});


    }

    // console.log(this.agendaDays);

  }


  onDisplayToggle(event) {
    // console.log(event);

  }

  onAdd() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    // dialogConfig.closeOnNavigation = false;

    dialogConfig.data = {
      property: 'name',
      label: 'Nombre del evento',
      value: '',
      unfilled: true,
      type: 'text',
      defaultValue: '',
    };

    dialogConfig.width = '400px';

    this.dialog.open(EditDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(newValue => {
        if (newValue !== null) {
          if (newValue !== dialogConfig.data.value) {
            const created = firebase.firestore.Timestamp.fromDate(new Date(this.today.toDate()));
            this.eventsService.addEvent({
              [dialogConfig.data.property]: newValue,
              date: created,
            }).subscribe( ( result ) => {
              this.router.navigateByUrl(`/events/${result.id}`);
            },
            error => {
              const message = this.uiService.translateFirestoreError(error);
              this.uiService.showStdSnackbar(message);
            });

          }
        }
      });

  }

  OnDisplayEvent(item) {
    this.eventsService.fetchEvent(item.id).pipe(
      take(1)
    )
    .subscribe( event => {

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.hasBackdrop = true;
      dialogConfig.closeOnNavigation = true;


      dialogConfig.data = {
        ...event,
        isAdmin: this.user.isAdmin
      };

      // dialogConfig.width = '400px';
      dialogConfig.minWidth = '400px'
      dialogConfig.maxWidth = "80vw"


      this.dialog.open(EventDialogComponent, dialogConfig)

    });



  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }


  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }


}
