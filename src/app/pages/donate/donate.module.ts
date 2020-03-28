import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
//import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

import { IonicModule } from '@ionic/angular';
// import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { faTelegram, faTwitter, faGithub, faMedium, faYoutube, faChrome, faRedditAlien, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { DonatePage } from './donate.page';


const routes: Routes = [
  {
    path: '',
    component: DonatePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //TranslateModule,
    ComponentsModule,
    //FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DonatePage]
})
export class DonatePageModule {
  // constructor(private library: FaIconLibrary) {
  //   library.addIcons(faEnvelope, faTelegram, faTwitter, faGithub, faMedium, faYoutube, faChrome, faRedditAlien, faLinkedin);
  // }
}