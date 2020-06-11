import { Injectable, NgZone } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class Native {

    private loadingIsOpen: boolean = false;
    public modalOpen: boolean = false;

    constructor(
        private inappBrowser: InAppBrowser,
        private navController: NavController,
        private loadingCtrl: LoadingController,
        private router: Router,
        private zone: NgZone
    ) { }

    public openUrl(url: string) {
        const target = "_system";
        const options = "location=no";
        this.inappBrowser.create(url, target, options);
    }

    public setRootRouter(page: any, options: any = {}) {
        console.log("Setting root router path to:", page);
        this.zone.run(() => {
            this.hideLoading();
            this.navController.setDirection('root');
            this.router.navigate([page], { queryParams: options });
        });
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
}