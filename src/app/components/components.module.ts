import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonicImageLoader } from 'ionic-image-loader';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { TranslateModule } from '@ngx-translate/core';
import { Routes, RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { HeaderBarComponent } from './header-bar/header-bar.component';
import { MenuComponent } from './menu/menu.component';
import { NodeSliderComponent } from './node-slider/node-slider.component';

@NgModule({
  declarations: [HeaderBarComponent, MenuComponent, NodeSliderComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicImageLoader,
    TranslateModule,
    RouterModule,
    FontAwesomeModule,
    TruncateModule
  ],
  exports: [HeaderBarComponent,  MenuComponent, NodeSliderComponent],
  providers: [
  ],
  entryComponents: [],
})
export class ComponentsModule {
}