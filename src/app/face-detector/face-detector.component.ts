import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { Base64ToBlobService } from '../base64-to-blob.service';
import { DataAccessService } from '../data-access.service';
import { FaceDetectionService, DetectedFace } from '../face-detection.service';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Subscription, Subject, fromEvent } from 'rxjs';

export interface DetectedFaceImage {
  faceId: string;
  imageUrl?: string;
  imageData?: Blob;
}

@Component({
  selector: 'app-face-detector',
  templateUrl: './face-detector.component.html',
  styleUrls: ['./face-detector.component.scss']
})
export class FaceDetectorComponent implements OnInit, AfterViewInit, OnDestroy {
  private takePictureSubscription: Subscription;
  @ViewChild('takePictureButton', { static: false, read: ElementRef }) private takePictureButton: ElementRef;
  @ViewChild(WebcamComponent, { static: false }) private webcam: WebcamComponent;

  videoWidth = 350;
  status = 'clickToTakePicture';
  takePicture = new Subject<void>();
  @Output() faceDetected = new EventEmitter<DetectedFaceImage>();

  constructor(private converter: Base64ToBlobService,
              private dal: DataAccessService, private detector: FaceDetectionService) {
  }

  async ngOnInit() {
    this.videoWidth = (await this.dal.getSettings()).videoWidth;
  }

  ngOnDestroy(): void {
    this.takePictureSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.takePictureSubscription = fromEvent<void>(this.takePictureButton.nativeElement, 'click')
      .subscribe(() => this.takePicture.next());

    this.webcam.imageCapture.subscribe(async (data: WebcamImage) => {
      this.status = 'processing';
      const blob = this.converter.ConvertBase64ToBlob(data.imageAsBase64, 'image/jpg');
      const result = await this.detector.detect(blob);

      if (result.numberOfFaces === 0) {
        this.status = 'noFaces';
        return;
      }

      if (result.numberOfFaces > 1) {
        this.status = 'tooManyFaces';
        return;
      }

      this.status = 'detected';
      this.faceDetected.emit({ faceId: result.faceId, imageUrl: data.imageAsDataUrl, imageData: blob });
    });
  }
}
