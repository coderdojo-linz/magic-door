import { Component, OnInit } from '@angular/core';
import { Settings, DataAccessService } from '../data-access.service';
import { FaceDetectionService } from '../face-detection.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  private readonly faceListId = 'aec2019';

  settings: Settings = { version: 'v1', location: '', key: '', videoWidth: 0 };
  status = '';
  faceListIsOk = true;

  constructor(private dal: DataAccessService, private detection: FaceDetectionService) {}

  async ngOnInit() {
    this.settings = await this.dal.getSettings();
    await this.checkFaceList();
  }

  async save() {
    await this.dal.saveSettings(this.settings);
    this.settings = await this.dal.getSettings();
    this.status = 'Settings saved.';
    setTimeout(() => this.status = '', 3000);
  }

  async checkFaceList() {
    try {
      await this.detection.getFaceList();
      this.faceListIsOk = true;
    } catch {
      this.faceListIsOk = false;
    }
  }

  async recreateFaceList() {
    this.status = '(Re)creating face list, please be patient';
    try {
      await this.detection.deleteFaceList();
    } catch { }

    try {
      await this.detection.addFaceList('Ars Electronica Festival 2019');
      this.status = 'Face list (re)created';
    } catch {
      this.status = 'Error while (re)creating face list';
    }
  }
}
