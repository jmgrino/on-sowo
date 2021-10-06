import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-button',
  templateUrl: './header-button.component.html',
  styleUrls: ['./header-button.component.scss'],
})
export class HeaderButtonComponent implements OnInit {
  @Input() iconName: string;
  @Output() clicked =  new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  onClick() {
    this.clicked.emit();
  }

}
