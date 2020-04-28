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
            appManager.setVisible("show", () => { }, (err) => { });
            titleBarManager.setTitle(this.translate.instant('ELAnodes'))
            titleBarManager.setBackgroundColor("#000000");
            titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
            titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.HOME);
            let menuItems = [
                {
                    key: "minimize",
                    iconPath: "assets/icon/minimize.png",
                    title: "Minimize"
                },
                {
                    key: "close",
                    iconPath: "assets/icon/close.png",
                    title: "Close"
                }
            ];
            titleBarManager.setupMenuItems(menuItems, (selectedMenuItem) => {
                switch (selectedMenuItem.key) {
                    case "minimize":
                        appManager.launcher();
                        break;
                    case "close":
                        appManager.close();
                        break;
                }
            });

            this.firstLoad = false;
        } else {
            setTimeout(() => {
                this.router.navigate(['/tabs/vote']);
            }, 750);
        }

    }

}