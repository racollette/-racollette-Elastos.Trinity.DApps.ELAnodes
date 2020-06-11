import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { Native } from '../../services/native.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    public version = "0.8.0";

    constructor(
        private translate: TranslateService,
        private navController: NavController,
        private native: Native
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        titleBarManager.setTitle(this.translate.instant('about-title'))
    }

    ionViewDidEnter() {
    }

    public goWebsite() {
        this.native.openUrl("https://starfish-supernode.tech");
    }

    public goSocial(link: string) {
        this.native.openUrl(link);
    }

}
