import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

interface CalendarDay {
  order: number;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  user: User;
  today: Date;
  day: number; // 0 (sunday) to 6 (saturday)
  year: number;
  month: number; // 0 (january) to 11 (december)
  firstDay: number;
  daysInMonth: number;
  // calendarDays: CalendarDay[];
  calendarDays: any[];


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
  ) { }

  ngOnInit() {

    // set the calendars year and month to todays date by default
    this.today = new Date();
    this.day = this.today.getDate();
    this.month = this.today.getMonth();
    this.year = this.today.getFullYear();

    // get the first day of the month. this is an enumerated index, so 0 is Sunday and 6 is Saturday.
    this.firstDay = (new Date(this.year, this.month, 1)).getDay();

    // using a 0 param in the day slot of Date() gives you the last day automatically. fantastic.
    this.daysInMonth = new Date(this.year, this.month, 0).getDate();



    this.calendarDays = [];

    for (let i = 1; i < 43; i++) {
      this.calendarDays.push({
        order: i,
        items: [
          {
          name: 'Item 1',
          },
          {
          name: 'Item 2',
          },
        ]
      })
    }

    console.log(this.calendarDays);




    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
      }
    });

  }

  ionViewWillEnter(event) {
    this.sidemenu.enable(true);
  }

  chosenYearHandler() {
    console.log(event);

  }

  chosenMonthHandler(event, dp) {
    console.log(event);
    console.log(dp);

  }

}
