import { Component, OnInit, NgZone } from '@angular/core';
import { Native } from '../../services/native.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(public native: Native,
        public translate: TranslateService,
        public data: DataService,
        private navController: NavController
    ) { }

    public lang: string;

    ngOnInit() {
    }

    ionViewWillEnter() {
        titleBarManager.setTitle(this.translate.instant('settings-title'))
        this.lang = this.data.language
    }

    ionViewDidEnter() {
    }

    // general = [
    //     {
    //         route: "/tabs/language",
    //         icon: "md-globe"
    //     },
    //     {
    //         route: "/tabs/notification",
    //         icon: "notifications-outline"
    //     }
    // ];

    // storage = [
    //     {
    //         route: "/tabs/wallets",
    //         icon: "wallet"
    //     },
    // ];

    // about = [
    //     {
    //         route: "/tabs/about",
    //         icon: "md-alert",
    //         note: "v1.0"
    //     },
    //     {
    //         route: "/tutorial",
    //         icon: "md-photos"
    //     },
    //     {
    //         route: "/tabs/faq",
    //         icon: "help-circle"
    //     },
    //     {
    //         route: "/tabs/donate",
    //         icon: "thumbs-up"
    //     },
    // ];

    public goWebsite() {
        this.native.openUrl("https://starfish-supernode.tech");
    }

    public goSocial(link: string) {
        this.native.openUrl(link);
    }

}
