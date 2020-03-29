import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { IonicModule } from '@ionic/angular';
import { IonicImageLoader } from 'ionic-image-loader';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
//import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faTelegram, faTwitter, faGithub, faMedium, faFacebook, faYoutube, faWeixin, faChrome, faWeibo, faQq, faReddit, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import { ComponentsModule } from '../../components/components.module';
import { VotePage } from './vote.page';
//import { NodeSliderComponent } from '../../components/node-slider/node-slider.component';


const routes: Routes = [
  {
    path: '',
    component: VotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    NgxDatatableModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    FontAwesomeModule
  ],
  declarations: [VotePage]
})
export class VotePageModule { 
  constructor(private library: FaIconLibrary) {
    library.addIcons(faEnvelope, faTelegram, faTwitter, faGithub, faMedium, faFacebook, faYoutube, faWeixin, faChrome, faWeibo, faQq, faReddit, faLinkedin);
  }
}
