import { Component, OnInit } from '@angular/core';
import { Settings, DataAccessService } from '../data-access.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings = { version: 'v1', location: '', key: '' };
  status = '';

  constructor(private dal: DataAccessService) {}

  async ngOnInit() {
    this.settings = await this.dal.getSettings();
  }

  async save() {
    await this.dal.saveSettings(this.settings);
    this.settings = await this.dal.getSettings();
    this.status = 'Settings saved.';
    setTimeout(() => this.status = '', 3000);
  }
}
