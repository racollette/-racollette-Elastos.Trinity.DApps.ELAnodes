import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController, IonRouterOutlet } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { NodesService } from './services/nodes.service';
import { DataService } from './services/data.service';
import { Native } from 'src/app/services/native.service';
import { VotePage } from './pages/vote/vote.page';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;

@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  styleUrls: ['./app.scss']
})
export class MyApp {

  @ViewChild(IonRouterOutlet, {static:false} ) routerOutlet: IonRouterOutlet;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public nodesService: NodesService,
    private data: DataService,
    private native: Native,
    private votePage: VotePage,
    public translate: TranslateService,
    private router: Router,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  public menuInitialized: boolean = false;

  initializeApp() {
    console.log('Initializing the application')
    this.platform.ready().then(() => {
      console.log("Platform is ready");
      this.statusBar.styleDefault();
      this.setupBackKeyNavigation();
      this.native.setRootRouter('/splashscreen');
      this.nodesService.init();
      this.data.init();
    });
  }

  menuOpened() {
    if (!this.menuInitialized) {
      this.votePage.pushMenu();
      this.menuInitialized = true;
    }
  }

  setupBackKeyNavigation() {
    this.platform.backButton.subscribeWithPriority(0, () => {
        appManager.launcher();
        // if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        //     this.routerOutlet.pop();
        // } else {
        //  navigator['app'].exitApp();
        //}
    });
  }

}

