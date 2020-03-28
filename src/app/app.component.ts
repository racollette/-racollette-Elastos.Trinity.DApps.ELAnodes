import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NodesService } from './services/nodes.service';
import { DataService } from './services/data.service';
import { VotePage } from './pages/vote/vote.page';


@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  styleUrls: ['./app.scss']
})
export class MyApp {

  public loaded: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nodesService: NodesService,
    private data: DataService,
    private votePage: VotePage,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.nodesService.init();
      this.data.init();
      this.data.loaded.subscribe(load => this.loaded = load)
    });
  }

  menuOpened() {
    this.votePage.pushMenu();
  }

}

