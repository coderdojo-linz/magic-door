import { Injectable } from '@angular/core';
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';

export interface Settings {
  version: string;
  location: string;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor() { }

  private db: IDBPDatabase<unknown>;

  public async initialize() {
    this.db = await openDB(name, 1, {
      upgrade(db) {
        db.createObjectStore('settings', { keyPath: 'version', autoIncrement: false });
      }
    });
  }

  public async getSettings(): Promise<Settings> {
    return (await this.db.get('settings', 'v1')) || { version: 'v1', location: 'westeurope', key: '' };
  }

  public async saveSettings(settings: Settings) {
    await this.db.put('settings', settings);
  }
}
