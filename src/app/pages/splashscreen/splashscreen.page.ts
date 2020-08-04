import { Component, OnInit, NgZone } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-splashscreen',
    templateUrl: './splashscreen.page.html',
    styleUrls: ['./splashscreen.page.scss'],
})
export class SplashscreenPage implements OnInit {

    constructor(
        private translate: TranslateService,
        private router: Router,
        private zone: NgZone
    ) { }

    public firstLoad: boolean = true;

    ngOnInit() {
    }

    ionViewWillEnter() {
        if (this.firstLoad) {
            console.log('SPLASHSCREEN WILL ENTER')
            titleBarManager.setTitle(this.translate.instant('ELAnodes'))
            titleBarManager.setBackgroundColor("#000000");
            titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
            titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
            titleBarManager.setupMenuItems(null);
            this.firstLoad = false;
            appManager.setVisible("show", () => { }, (err) => { });
        } else {
            setTimeout(() => {
                this.router.navigate(['/tabs/vote']);
            }, 750);
        }

    }

}