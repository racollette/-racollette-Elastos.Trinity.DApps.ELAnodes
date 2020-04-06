import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { TutorialPage } from './tutorial.page';


const routes: Routes = [
  {
    path: '',
    component: TutorialPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    TranslateModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TutorialPage]
})
export class TutorialPageModule {}
