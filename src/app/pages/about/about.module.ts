import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTelegram, faTwitter, faGithub, faMedium, faYoutube, faChrome, faRedditAlien, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { AboutPage } from './about.page';


const routes: Routes = [
  {
    path: '',
    component: AboutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TranslateModule,
    FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faEnvelope, faTelegram, faTwitter, faGithub, faMedium, faYoutube, faChrome, faRedditAlien, faLinkedin);
  }
}