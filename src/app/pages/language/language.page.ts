import { Component, OnInit, NgZone } from '@angular/core';
import { Native } from '../../services/native.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
    selector: 'app-language',
    templateUrl: './language.page.html',
    styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

    constructor(public native: Native,
        public translate: TranslateService,
        public data: DataService,
        private navController: NavController,
        private zone: NgZone
    ) { }

    public lang: string;

    ngOnInit() {
    }

    ionViewWillEnter() {
        titleBarManager.setTitle(this.translate.instant('language-title'))
        this.lang = this.data.language
    }

    ionViewDidEnter() {
    }

    languageChoice(event) {
        this.zone.run(() => {
            this.lang = event.detail.value
            console.log('Language Set: ' + this.lang)
            this.data.setCurLang(this.lang)
            titleBarManager.setTitle(this.translate.instant('language-title'))
        });
    }

}
