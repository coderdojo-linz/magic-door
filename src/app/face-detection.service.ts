import { Injectable } from '@angular/core';
import { Face, DataAccessService } from './data-access.service';
import { HttpClient } from '@angular/common/http';

export interface DetectedFace {
  numberOfFaces: number;
  faceId?: string;
}

export interface RecognizedFace {
  faceId: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {

  constructor(private http: HttpClient, private dal: DataAccessService) {
  }

  public async detect(image: Blob) {
    const settings = await this.dal.getSettings();

    const url = `https://${settings.location}.api.cognitive.microsoft.com/face/v1.0` +
      `/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_01` +
      `&returnRecognitionModel=false&detectionModel=detection_01`;
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/octet-stream'
    };

    return new Promise<DetectedFace>((res, rej) => {
      this.http.post(url, image, { headers })
        .subscribe({
          next: (result: Face[]) => {
            if (result.length === 0 || result.length > 1) {
              res({ numberOfFaces: result.length });
              return;
            }

            res({ numberOfFaces: 1, faceId: result[0].faceId });
          },
          error: () => rej()
        });
    });
  }

  public async findSimilar(faceId: string) {
    const settings = await this.dal.getSettings();

    const url = `https://${settings.location}.api.cognitive.microsoft.com/face/v1.0/findsimilars`;
    const headers = {
      'Ocp-Apim-Subscription-Key': settings.key,
      'Content-Type': 'application/json'
    };
    const faces = await this.dal.getAllFaceIds();

    return new Promise<RecognizedFace[]>((res, rej) => {
      this.http.post(url, {
        faceId,
        faceIds: faces
      }, { headers })
        .subscribe({
          next: (result: RecognizedFace[]) => res(result),
          error: () => rej()
        });
    });
  }
}
