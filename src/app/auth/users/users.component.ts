import { UIService } from 'src/app/shared/ui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActiveCampaignService } from '../active-campaign.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { OnsowersService } from 'src/app/onsowers/onsowers.service';
import { environment } from './../../../environments/environment';

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
  alertButtons = [];


  constructor(
    private auth: AuthService,
    private sidemenu: MenuController,
    private acService: ActiveCampaignService,
    private alertController: AlertController,
    private uiService: UIService,
    private onsowersService: OnsowersService,
  ) { }

  ngOnInit() {

    this.auth.getCurrentUser().subscribe( user => {
      console.log(user);

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

    // Uncomment next 4 lines to console-log tags id's.
    // this.acService.fetchTags().subscribe( tags => {
    //   console.log('Tags', tags);
    // });
    // Return;


    if (window.location.hostname !== 'localhost') {
      this.alertButtons = [
        {
          text: 'Aceptar',
          role: 'cancel',
        }
      ];
      this.presentAlert('Solo funciona desde localhost');
      return;
    }

    this.acService.fetchContacts().subscribe( contacts => {

      const missingContacts = this.users.filter( user => {

        if (user.onlyAdmin || user.sendToCA) {
          return false;
        } else {
          return !contacts.some( contact => {
            return (contact.email === user.email);
          })
        }

      });




      const missingNames = missingContacts.map( contact => {
        return '<li>' + contact.displayName + ' ' + contact.familyName + '</li>';
      });


      let message = "";

      if (missingContacts.length > 0) {
        message = '<ol>';
        message += missingNames.join('');
        message += '</ol>';

        this.alertButtons = [
          {
            text: 'Cancelar',
            role: 'cancel',
          }, {
            text: 'Enviar',
            role: 'submit'
          }
        ];


      } else {
        message = "<h3>Ninguno</h3>";

        this.alertButtons = [
          {
            text: 'Aceptar',
            role: 'cancel',
          }
        ];
      }

      this.presentAlert(message).then( result => {
        if (result.role === 'submit') {

          for (const contact of missingContacts) {

            const acContact = {
              "email": contact.email,
              "firstName": contact.displayName,
              "lastName": contact.familyName
            }

            this.acService.saveContact(acContact).subscribe( result => {
              const contactId = result['contact']['id'];

              this.acService.addTagToContact(contactId).subscribe( result => {
                if (environment.activeCampaign.domain === 'https://sowocoworking.api-us1.com') {
                  if (contact.email === 'miriamgrinyo@gmail.com') {
                    console.log(contact.email);

                    this.onsowersService.saveOnsower(contact.uid, {sendToCA: true}).subscribe();

                  }
                }
                if ( missingContacts.indexOf(contact) === (missingContacts.length - 1) ) {
                  const number = missingContacts.length;
                  if (number === 1) {
                    const message = number + ' contacto enviado a Actice Campaign';
                    this.uiService.showStdSnackbar(message);
                  } else {
                    const message = number + ' contactos enviados a Actice Campaign';
                    this.uiService.showStdSnackbar(message);
                  }

                }

              });

            });


          }

        }


      });

    });

  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Contactos pendientes de enviar a Active Campaign',
      message: message,
      buttons: this.alertButtons,
      backdropDismiss: false
    });

    await alert.present();

    return alert.onDidDismiss();




  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

}
