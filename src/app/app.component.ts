import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NodesService } from './services/nodes.service';
import { DataService } from './services/data.service';
import { Native } from 'src/app/services/native.service';
import { VotePage } from './pages/vote/vote.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  styleUrls: ['./app.scss']
})
export class MyApp {

  public loaded: any;
  public tableInitialized: boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nodesService: NodesService,
    private data: DataService,
    private native: Native,
    private votePage: VotePage,
    public translate: TranslateService
  ) {
    this.native.setRootRouter('/splashscreen');
    this.initializeApp();
    //this.splashScreen.show();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //this.data.loaded.subscribe(load => this.loaded = load)
  
      this.statusBar.styleDefault();
      this.nodesService.init();
      this.data.init();
      //this.splashScreen.hide();
    });
  }

  menuOpened() {
    if (!this.tableInitialized) {
    this.votePage.pushMenu();
    this.tableInitialized = true;
    }
  }

}

