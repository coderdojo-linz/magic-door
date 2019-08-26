import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { WebcamModule } from 'ngx-webcam';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WizardComponent } from './wizard/wizard.component';
import { TakePictureComponent } from './take-picture/take-picture.component';
import { SettingsComponent } from './settings/settings.component';
import { DataAccessService } from './data-access.service';
import { AppLoadService } from './app-load.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DetectComponent } from './detect/detect.component';
import { FaceDetectorComponent } from './face-detector/face-detector.component';
import { RecognizedComponent } from './recognized/recognized.component';
import { BackToStartComponent } from './back-to-start/back-to-start.component';
import {MatIconModule} from '@angular/material/icon';

function initialize(appLoadService: AppLoadService) {
  return () => appLoadService.initialize();
}

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    WizardComponent,
    TakePictureComponent,
    SettingsComponent,
    DetectComponent,
    FaceDetectorComponent,
    RecognizedComponent,
    BackToStartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    WebcamModule,
    FlexLayoutModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  providers: [
    DataAccessService,
    AppLoadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
