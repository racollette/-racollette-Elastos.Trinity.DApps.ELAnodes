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

    general = [
        {
            route: "/tabs/language",
            label: "Language",
            label_zh: "语言",
            icon: "md-globe",
        },
        {
            route: "/tabs/notification",
            label: "Notification Options",
            label_zh: "通知选项",
            icon: "notifications-outline",
        }
    ];

    storage = [
        {
            route: "/tabs/wallets",
            label: "Wallets",
            label_zh: "皮夹",
            icon: "wallet",
        },
    ];

    about = [
        {
            route: "/tabs/about",
            label: "About",
            label_zh: "关于",
            icon: "md-alert",
            note: "v1.0",
        },
        {
            route: "/tutorial",
            label: "Tutorial",
            label_zh: "讲解",
            icon: "md-photos",
        },
        {
            route: "/tabs/faq",
            label: "F.A.Q.",
            label_zh: "常问问题",
            icon: "help-circle",
        },
        {
            route: "/tabs/donate",
            label: "Donate",
            label_zh: "捐",
            icon: "thumbs-up",
        },
    ];

    public goWebsite() {
        this.native.openUrl("https://starfish-supernode.tech");
    }

    public goSocial(link: string) {
        this.native.openUrl(link);
    }

}
