import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActiveCampaignService } from '../active-campaign.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  user: User;
  users: User[];
  defaultValue = '../../assets/img/unknown_person.png';
  usersSubscription: Subscription;


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private acService: ActiveCampaignService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {

    this.auth.getCurrentUser().subscribe( user => {
      if (user) {
        this.user = user;
        this.usersSubscription = this.auth.fetchUsers().subscribe( users => {
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

  onUpdateAC() {

    // Uncomment next 3 lines to console-log tags id's.
    // this.acService.fetchTags().subscribe( tags => {
    //   console.log('Tags', tags);
    // });

    if (window.location.hostname !== 'localhost') {
      this.presentAlert('Solo funciona desde localhost');
      return;
    }

    this.acService.fetchContacts().subscribe( contacts => {

      const missingContacts = this.users.filter( user => {

        console.log(user.email);

        if (user.onlyAdmin) {
          return false;
        } else {
          return !contacts.some( contact => {
            return (contact.email === user.email);
          })
        }

      });

      // const missingEmails = missingContacts.map( contact => {
      //   return contact.email;
      // });
      const missingNames = missingContacts.map( contact => {
        return '<li>' + contact.displayName + ' ' + contact.familyName + '</li>';
      });


      let message = "";

      if (missingContacts.length > 0) {
        message = '<ol>';
        message += missingNames.join('');
        message += '</ol>';


      } else {
        message = "<h3>Ninguno</h3>"
      }

      this.presentAlert(message);

    });







    // console.log( a2.filter(x => !a1.includes(x)) );

  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Contactos pendientes de enviar a Active Campaign',
      // subHeader: 'Subtitle',
      message: message,
      buttons: ['OK']
    });

    await alert.present();

  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

}
