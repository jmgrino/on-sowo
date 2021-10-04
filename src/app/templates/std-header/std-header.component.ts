import { DataService } from './../../shared/data.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-std-header',
  templateUrl: './std-header.component.html',
  styleUrls: ['./std-header.component.scss'],
})
export class StdHeaderComponent implements OnInit {
  @Input() user;
  @Input() isAdd: boolean;
  @Output() add = new EventEmitter<void>();

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {

  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }

  onAdd() {
    this.add.emit();
  }

}
