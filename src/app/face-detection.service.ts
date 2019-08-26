import { Injectable } from '@angular/core';
import { Face, DataAccessService, Settings } from './data-access.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface DetectedFace {
  numberOfFaces: number;
  faceId?: string;
}

export interface RecognizedFace {
  persistedFaceId: string;
  confidence: number;
}

export interface FaceList {
  faceListId: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {
  private readonly faceListId = 'aec2019';

  constructor(private http: HttpClient, private dal: DataAccessService) {
  }

  private buildUrl(settings: Settings, subUrl: string) {
    return `https://${settings.location}.api.cognitive.microsoft.com/face/v1.0/${subUrl}`;
  }

  public async detect(image: Blob): Promise<DetectedFace> {
    const settings = await this.dal.getSettings();

    const url = this.buildUrl(
      settings,
      `detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_01` +
      `&returnRecognitionModel=false&detectionModel=detection_01`
    );
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/octet-stream'
    };

    return new Promise<DetectedFace>((res, rej) => {
      this.http.post(url, image, { headers })
        .subscribe({
          next: (result: Face[]) => {
            if (result.length === 0 || result.length > 1) {
              // No or too many faces recognized. In that case, we return only the face count.
              res({ numberOfFaces: result.length });
              return;
            }

            // Detected a single face -> return face data
            res({ numberOfFaces: 1, faceId: result[0].faceId });
          },
          error: () => rej()
        });
    });
  }

  public async findSimilar(faceId: string) {
    const settings = await this.dal.getSettings();

    const url = this.buildUrl(settings, 'findsimilars');
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/json'
    };

    return new Promise<RecognizedFace[]>((res, rej) => {
      this.http.post(url, {
        faceId,
        faceListId: this.faceListId
      }, { headers })
        .subscribe({
          next: (result: RecognizedFace[]) => res(result),
          error: () => rej()
        });
    });
  }

  public async getFaceList() {
    const settings = await this.dal.getSettings();

    const url = this.buildUrl(settings, `facelists/${this.faceListId}`);
    const headers = { 'Ocp-Apim-Subscription-Key': settings.key };

    return new Promise<FaceList>((res, rej) => {
      this.http.get(url, { headers })
        .subscribe({
          next: (result: FaceList) => res(result),
          error: () => rej()
        });
    });
  }

  public async addFaceList(name: string) {
    const settings = await this.dal.getSettings();

    const url = this.buildUrl(settings, `facelists/${this.faceListId}`);
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/json'
    };

    return new Promise<void>((res, rej) => {
      this.http.put(url, { name }, { headers })
        .subscribe({ next: () => res(), error: () => rej() });
    });
  }

  public async deleteFaceList() {
    const settings = await this.dal.getSettings();

    const url = this.buildUrl(settings, `facelists/${this.faceListId}`);
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/json'
    };

    return new Promise<void>((res, rej) => {
      this.http.delete(url, { headers })
        .subscribe({ next: () => res(), error: () => rej() });
    });
  }

  public async addFaceToFacelist(image: Blob, name: string) {
    const settings = await this.dal.getSettings();

    const url = this.buildUrl(
      settings,
      `facelists/${this.faceListId}/persistedFaces?userData=${encodeURI(name)}`
    );
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/octet-stream'
    };

    return new Promise<string>((res, rej) => {
      this.http.post(url, image, { headers })
        .subscribe({
          next: (response: { persistedFaceId: string }) => res(response.persistedFaceId),
          error: () => rej()
        });
    });
  }
}
