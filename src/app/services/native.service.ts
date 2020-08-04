import { Injectable, NgZone } from '@angular/core';
import { ToastController, LoadingController, NavController, MenuController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class Native {

    private loadingIsOpen: boolean = false;
    public modalOpen: boolean = false;
    public menuOpen: boolean = false;

    constructor(
        private inappBrowser: InAppBrowser,
        private navController: NavController,
        private loadingCtrl: LoadingController,
        private router: Router,
        private zone: NgZone,
        public menuCtrl: MenuController
    ) { }

    public go(page: any, options: any = {}) {
        console.log("Navigating to:", page);
        this.zone.run(() => {
            this.hideLoading();
            this.navController.setDirection('forward');
            this.router.navigate([page], { queryParams: options });
        });
    }

    public openUrl(url: string) {
        const target = "_system";
        const options = "location=no";
        this.inappBrowser.create(url, target, options);
    }

    public async showLoading(content: string = '') {
        if (!this.loadingIsOpen) {
            this.loadingIsOpen = true;
            let loading = await this.loadingCtrl.create({
                message: content
            });
            return await loading.present();
        }
    }

    public hideLoading(): void {
        this.loadingIsOpen && this.loadingCtrl.dismiss();
        this.loadingIsOpen = false;
    }

    public openMenu() {
        this.menuCtrl.open();

    }

    public closeMenu() {
        this.menuCtrl.close();
    }
}