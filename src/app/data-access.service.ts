import { Injectable } from '@angular/core';
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase } from 'idb';

export interface Settings {
  version: string;
  location: string;
  key: string;
  videoWidth: number;
}

export interface Face {
  name: string;
  faceId: string;
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
        db.createObjectStore('faces', { keyPath: 'faceId', autoIncrement: false });
      }
    });
  }

  public async getSettings(): Promise<Settings> {
    return (await this.db.get('settings', 'v1')) || { version: 'v1', location: 'westeurope', key: '', videoWidth: 350 };
  }

  public async saveSettings(settings: Settings) {
    await this.db.put('settings', settings);
  }

  public async getFaceById(faceId: string): Promise<Face> {
    return await this.db.get('faces', faceId);
  }

  public async saveFace(name: string, faceId: string) {
    const item: Face = { name, faceId };
    await this.db.put('faces', item);
  }

  public async getAllFaceIds() {
    const faces: IDBValidKey[] = await this.db.getAllKeys('faces');
    return faces.filter((f, ix) => ix < 1000).map(f => f.toString());
  }
}
