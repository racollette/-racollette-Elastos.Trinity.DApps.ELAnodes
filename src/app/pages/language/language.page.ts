import { Component, OnInit } from '@angular/core';
import { Native } from '../../services/native.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-language',
    templateUrl: './language.page.html',
    styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

    constructor(public native: Native,
        public translate: TranslateService) {
        // this language will be used as a fallback when a translation isn't found in the current language
        translate.setDefaultLang('en');
    }

    ngOnInit() {
        // Add to storage service and loading scripts
        console.log('Language Set: ' + this.lang)
    }

    public lang: string = 'en'

    languageChoice(event) {
        this.lang = event.detail.value
        console.log('Language Set: ' + this.lang)
        this.translate.use(this.lang)
    }
}