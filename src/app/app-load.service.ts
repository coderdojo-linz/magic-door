import { Injectable } from '@angular/core';
import { DataAccessService } from './data-access.service';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {
  constructor(private dal: DataAccessService) {}

  async initialize() {
    await this.dal.initialize();
  }
}
