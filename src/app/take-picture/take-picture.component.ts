import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { WindowSizeService } from '../window-size.service';
import { Subscription, Subject, fromEvent, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Base64ToBlobService } from '../base64-to-blob.service';
import { HttpClient } from '@angular/common/http';
import { DataAccessService } from '../data-access.service';

interface Face {
  faceId: string;
  faceRectangle: any;
}

@Component({
  selector: 'app-take-picture',
  templateUrl: './take-picture.component.html',
  styleUrls: ['./take-picture.component.scss']
})
export class TakePictureComponent implements OnInit, AfterViewInit, OnDestroy {
  private resizeSubscription: Subscription;
  private takePictureSubscription: Subscription;
  @ViewChild('takePictureButton', { static: false, read: ElementRef }) private takePictureButton: ElementRef;
  @ViewChild(WebcamComponent, { static: false }) private webcam: WebcamComponent;

  videoWidth = 300;
  takePicture = new Subject<void>();
  images: WebcamImage[] = [null, null, null];
  imageIndex = 0;
  working = false;
  noFaceInImage = false;

  constructor(private resize: WindowSizeService, private converter: Base64ToBlobService,
              private http: HttpClient, private dal: DataAccessService) {
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
    this.takePictureSubscription.unsubscribe();
  }

  ngOnInit() {
    this.resizeSubscription = this.resize.resize$.subscribe(size => this.videoWidth = Math.min(size.width / 2, 400));
  }

  ngAfterViewInit(): void {
    this.takePictureSubscription = fromEvent<void>(this.takePictureButton.nativeElement, 'click').pipe(
      tap(() => console.log('Taking picture'))
    ).subscribe(() => this.takePicture.next());

    this.webcam.imageCapture.subscribe(async (data: WebcamImage) => {
      this.working = true;
      const settings = await this.dal.getSettings();
      const blob = this.converter.ConvertBase64ToBlob(data.imageAsBase64, 'image/jpg');
      this.http.post(
        `https://${settings.location}.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_01&returnRecognitionModel=false&detectionModel=detection_01`,
        blob, { headers: {
          'Ocp-Apim-Subscription-Key': settings.key,
          'Content-Type': 'application/octet-stream'
        }})
        .subscribe((result: Face[]) => {
          if (result.length > 0) {
            this.images[this.imageIndex] = data;
            this.imageIndex = ++this.imageIndex % 3;
            this.noFaceInImage = false;
          } else {
            this.noFaceInImage = true;
          }

          this.working = false;
        });
    });
  }
}
