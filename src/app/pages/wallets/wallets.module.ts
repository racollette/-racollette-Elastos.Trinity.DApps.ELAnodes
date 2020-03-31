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

import { WalletsPage } from './wallets.page';


const routes: Routes = [
  {
    path: '',
    component: WalletsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    //TranslateModule,
    ComponentsModule,
    //FontAwesomeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WalletsPage]
})
export class WalletsPageModule {
}