import { Component, OnInit, NgZone } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-faq',
    templateUrl: './faq.page.html',
    styleUrls: ['./faq.page.scss'],
})
export class FAQPage implements OnInit {

    constructor(
        private translate: TranslateService,
        private navController: NavController
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        titleBarManager.setTitle(this.translate.instant("faq-title"));
    }

    ionViewDidEnter() {
    }

}
