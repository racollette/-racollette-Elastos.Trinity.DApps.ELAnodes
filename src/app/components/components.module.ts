import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicImageLoader } from 'ionic-image-loader';
import { TruncateModule } from '@yellowspot/ng-truncate';

//import { TranslateModule } from '@ngx-translate/core';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoins, faHandHoldingUsd, faQuestionCircle, faNetworkWired, faChartBar, faChartLine, faChartArea, faCog } from '@fortawesome/free-solid-svg-icons';

import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { NodeSliderComponent } from './node-slider/node-slider.component';

@NgModule({
  declarations: [HeaderBarComponent, NavComponent, MenuComponent, NodeSliderComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    FontAwesomeModule,
    TruncateModule
//  TranslateModule,
  ],
  exports: [HeaderBarComponent, NavComponent, MenuComponent, NodeSliderComponent],
  providers: [
  ],
  entryComponents: [],
})
export class ComponentsModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faCoins, faHandHoldingUsd, faQuestionCircle, faNetworkWired, faChartBar, faChartLine, faChartArea, faCog);
  }  
 }