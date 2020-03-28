import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

declare let appManager: any;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

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
    private storageService: StorageService
  ) {
  }

  ngOnInit() {}

  ionViewDidEnter() {
    appManager.setVisible("show", ()=>{}, (err)=>{});
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
