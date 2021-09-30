import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActiveCampaignService {
  myHost: string;

  constructor(
    private http: HttpClient,
  )
  {
    if (window.location.hostname==='localhost') {
      this.myHost = 'http://localhost:8100';
    } else {
      this.myHost = environment.activeCampaign.domain;
      // https://musil1632158729.api-us1.com
    }
  }

  fetchContacts() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, */*',
        'Api-Token': environment.activeCampaign.apiKey,
      })
    };


    return this.http.get(`${this.myHost}/contacts` , httpOptions).pipe(
      take(1),
      map( result => {

        const contacts = result['contacts'];

        const accountContacts = [];

        for (const contact of contacts) {
          const accountContact = {
            id: contact.id,
            email: contact.email,
            firstName: contact.firstName,
            lastName: contact.lastName,
          };

          accountContacts.push(accountContact);

        }

        return accountContacts;
      })
    );

  }

  saveContact(contact) {
    const acContact = {
      contact: contact
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, */*',
        'Api-Token': environment.activeCampaign.apiKey,
      })
    };

    return this.http.post(`${this.myHost}/contacts` , acContact, httpOptions );

  }

  addTagToContact(contactId) {

    const contactTag = {
      "contactTag": {
        "contact": contactId,
        "tag": environment.activeCampaign.tagId
      }
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, */*',
        'Api-Token': environment.activeCampaign.apiKey,
      })
    };

    return this.http.post(`${this.myHost}/contactTags` , contactTag, httpOptions );

  }

  fetchTags() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, */*',
        'Api-Token': environment.activeCampaign.apiKey
      })
    };

    return this.http.get(`${this.myHost}/tags` , httpOptions)
  }


}
