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
import { NodeSliderComponent } from '../../components/node-slider/node-slider.component';
import { TruncateModule } from '@yellowspot/ng-truncate';

const routes: Routes = [
  {
    path: '',
    component: VotePage
  }
];

// const routes: Routes = [
//   {
//     path: 'vote',
//     component: VotePage,
//     children: [
//       {
//         path: 'home',
//         loadChildren: '../home/home.module#HomePageModule'
//       },
//       {
//         path: 'intro',
//         loadChildren: '../intro/intro.module#IntroPageModule'
//       },
//       {
//         path: 'stats',
//         loadChildren: '../stats/stats.module#StatsPageModule'
//       },
//       {
//         path: 'settings',
//         loadChildren: '../settings/settings.module#SettingsPageModule'
//       },
//        {
//         path: 'settings/:about',
//         loadChildren: '../about/about.module#AboutPageModule'
//       },
//       {
//         path: 'settings/:donate',
//         loadChildren: '../donate/donate.module#DonatePageModule'
//       },
//       {
//         path: 'menu',
//         loadChildren: '../menu/menu.module#MenuPageModule'
//       },
//       {
//         path: 'history',
//         loadChildren: '../history/history.module#HistoryPageModule'
//       },
//       {
//         path: 'history/:txId',
//         loadChildren: '../tx/tx.module#TxPageModule'
//       },
//     ]
//   },
//   {
//     path: '',
//     redirectTo: 'vote'
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    NgxDatatableModule,
    ComponentsModule,
    TruncateModule,
    RouterModule.forChild(routes),
    FontAwesomeModule
  ],
  declarations: [VotePage, NodeSliderComponent]
})
export class VotePageModule { 
  constructor(private library: FaIconLibrary) {
    library.addIcons(faEnvelope, faTelegram, faTwitter, faGithub, faMedium, faFacebook, faYoutube, faWeixin, faChrome, faWeibo, faQq, faReddit, faLinkedin);
  }
}
