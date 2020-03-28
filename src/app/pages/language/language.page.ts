import { Component, OnInit } from '@angular/core';
import { Native } from '../../services/native.service';


@Component({
    selector: 'app-language',
    templateUrl: './language.page.html',
    styleUrls: ['./language.page.scss'],
})
export class LanguagePage implements OnInit {

    constructor(
        public native: Native
    ) {}

    ngOnInit() {
        console.log('Language Set: ' + this.lang)
    }

    public lang: string = 'English'

    mcqAnswer(event) {
        this.lang = event.detail.value
        console.log('Language Set: ' + this.lang)
    }
}