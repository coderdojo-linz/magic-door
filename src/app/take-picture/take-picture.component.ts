import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataAccessService } from '../data-access.service';
import { FaceDetectorComponent, DetectedFaceImage } from '../face-detector/face-detector.component';
import { FaceDetectionService } from '../face-detection.service';

@Component({
  selector: 'app-take-picture',
  templateUrl: './take-picture.component.html',
  styleUrls: ['./take-picture.component.scss']
})
export class TakePictureComponent implements OnInit, AfterViewInit, OnDestroy {
  private takePictureSubscription: Subscription;
  @ViewChild(FaceDetectorComponent, { static: true }) private detector: FaceDetectorComponent;

  images: DetectedFaceImage[] = [null, null, null];
  imageIndex = 0;
  name = '';

  constructor(private dal: DataAccessService, private faceDetection: FaceDetectionService) {
  }

  ngOnDestroy(): void {
    this.takePictureSubscription.unsubscribe();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.takePictureSubscription = this.detector.faceDetected.subscribe(async (face: DetectedFaceImage) => {
        this.images[this.imageIndex] = face;
        this.imageIndex = ++this.imageIndex % 3;

        const persistedFaceId = await this.faceDetection.addFaceToFacelist(face.imageData, this.name);
        await this.dal.saveFace(this.name, persistedFaceId);
    });
  }
}
