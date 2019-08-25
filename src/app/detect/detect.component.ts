import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Base64ToBlobService } from '../base64-to-blob.service';
import { Subscription, fromEvent, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataAccessService, Face } from '../data-access.service';
import { HttpClient } from '@angular/common/http';
import { FaceDetectionService, RecognizedFace } from '../face-detection.service';
import { FaceDetectorComponent, DetectedFaceImage } from '../face-detector/face-detector.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detect',
  templateUrl: './detect.component.html',
  styleUrls: ['./detect.component.scss']
})
export class DetectComponent implements OnInit, OnDestroy, AfterViewInit {
  private takePictureSubscription: Subscription;
  @ViewChild(FaceDetectorComponent, { static: true }) private detector: FaceDetectorComponent;

  constructor(private dal: DataAccessService, private detectionService: FaceDetectionService,
    private router: Router) {
  }

  ngOnDestroy(): void {
    this.takePictureSubscription.unsubscribe();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.takePictureSubscription = this.detector.faceDetected.subscribe(async (face: DetectedFaceImage) => {
        await this.dal.saveFace('', face.faceId);

        let faces = await this.detectionService.findSimilar(face.faceId);
        faces = faces.filter(f => f.faceId !== face.faceId);
        let maxConfidence = 0;
        let maxConfidenceFace: RecognizedFace;
        for (const f of faces) {
          if (f.confidence > maxConfidence) {
            maxConfidence = f.confidence;
            maxConfidenceFace = f;
          }
        }

        if (maxConfidenceFace) {
          const knownFace = await this.dal.getFaceById(maxConfidenceFace.faceId);
          if (knownFace) {
            this.router.navigateByUrl(`/recognized?faceId=${knownFace.faceId}&name=${knownFace.name}`);
            return;
          }
        }

        this.router.navigateByUrl(`/recognized`);
    });
  }
}
