import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.scss'],
})
export class EditBannerComponent implements OnInit {
  @Input() editMode;
  @Input() field;
  @Output() editField = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  onEditField() {
    this.editField.emit(this.field);
  }

}
