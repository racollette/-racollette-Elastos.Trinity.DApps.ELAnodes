import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NodesService } from 'src/app/services/nodes.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.page.html',
    styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

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
        private navController: NavController,
        private translate: TranslateService,
        private nodesService: NodesService
    ) {
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        appManager.setVisible("show", () => { }, (err) => { });
        titleBarManager.setTitle(this.translate.instant('tutorial-title'))
        //appManager.setListener((ret) => { this.onMessageReceived(ret) });
    }

    // onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
    //     if (ret.message == "navback" && this.nodesService.firstVisit) {
    //         this.closeApp();
    //     } else {
    //         this.navController.back();
    //     }
    // }

    ionViewDidEnter() {
    }

    goToSupernodes() {
        this.storageService.setVisit(true);
        this.router.navigate(['tabs/vote']);
    }

    closeApp() {
        appManager.close();
    }

}
