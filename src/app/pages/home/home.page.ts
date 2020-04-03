import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // slider
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  next(slide) {
    slide.slideNext();
  }

  prev(slide) {
    slide.slidePrev();
  }

  constructor(
    private router: Router,
    private storageService: StorageService,
    private navController: NavController
  ) { }

  ngOnInit() { 
  }

  ionViewWillEnter() {
    appManager.setVisible("show", () => { }, (err) => { });
    titleBarManager.setTitle("ELAnodes");
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    appManager.setListener((ret) => {this.onMessageReceived(ret)});
  }

  onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
    if (ret.message == "navback") {
      this.navController.back();
    }
  }

  ionViewDidEnter() {
  }

  goToVote() {
    this.storageService.setVisit(true);
    this.router.navigate(['vote']);
  }

  // appManager
  closeApp() {
    appManager.close();
  }
}
