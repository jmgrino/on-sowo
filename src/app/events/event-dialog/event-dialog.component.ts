import { OsEvent } from './../event.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ShowdownConverter } from 'ngx-showdown';

interface EditDialogData extends OsEvent {
  isAdmin: Boolean;
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent implements OnInit {
  data: EditDialogData;
  osDate: any;

  constructor(
    private dialogRef: MatDialogRef<Component>,
    @Inject(MAT_DIALOG_DATA) data: EditDialogData,
    private router: Router,
    private showdownConverter: ShowdownConverter,
  ) {
    this.data = data;
    this.osDate = moment(data.date.toDate());
  }

  ngOnInit() { }

  makeHtml(markdownText: string) {

    this.showdownConverter.setOptions({
      tables: true,
      strikethrough: true,
      noHeaderId: true,
      openLinksInNewWindow: true,
      underline: true,
      literalMidWordUnderscores: true,
      simpleLineBreaks: true,
      headerLevelStart: 4,
    });
    return this.showdownConverter.makeHtml(markdownText);

    // return result.replace(new RegExp('\n', 'g'), "<br />");

  }

  onEdit() {
    this.dialogRef.close(null);
    this.router.navigateByUrl(`/events/${this.data.id}`);
  }

  onClose() {
    this.dialogRef.close(null);
  }



}
