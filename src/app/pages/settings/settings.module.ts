import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faTwitter, faGithub, faMedium, faYoutube, faChrome, faRedditAlien, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //TranslateModule,
    ComponentsModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faEnvelope, faTelegram, faTwitter, faGithub, faMedium, faYoutube, faChrome, faRedditAlien, faLinkedin);
  }
}