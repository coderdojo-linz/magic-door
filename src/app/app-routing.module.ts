import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { TakePictureComponent } from './take-picture/take-picture.component';
import { SettingsComponent } from './settings/settings.component';
import { DetectComponent } from './detect/detect.component';
import { RecognizedComponent } from './recognized/recognized.component';


const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'take-picture', component: TakePictureComponent },
  { path: 'detect', component: DetectComponent },
  { path: 'recognized', component: RecognizedComponent },
  { path: '', pathMatch: 'full', redirectTo: 'welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
