import { DataService } from './../../shared/data.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-std-header',
  templateUrl: './std-header.component.html',
  styleUrls: ['./std-header.component.scss'],
})
export class StdHeaderComponent implements OnInit {
  @Input() user;
  @Input() back;
  @Input() goBack;

  constructor(
    private dataService: DataService,
    private location: Location,
  ) { }

  ngOnInit() {

  }

  OnDiscord() {
    const discordLink = this.dataService.getDiscordLink();
    window.open(discordLink, "_blank");
  }

  onGoBack() {
    this.location.back()
  }

}
