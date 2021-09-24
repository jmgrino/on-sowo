import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  user: User;
  users: User[];
  defaultValue = '../../assets/img/unknown_person.png';


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
  ) { }

  ngOnInit() {

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        this.auth.fetchUsers().subscribe( users => {
          console.log(users);

          this.users = users;
        })
      }
    });

  }

  ionViewWillEnter() {
    this.sidemenu.enable(true);
  }

  printName(user) {
    const printName = (user.displayName ? user.displayName : '')
    + ' ' + (user.familyName ? user.familyName : '');

    if (printName.trim().length == 0) {
      return user.email;
    } else {
      return printName;
    }
  }

}
