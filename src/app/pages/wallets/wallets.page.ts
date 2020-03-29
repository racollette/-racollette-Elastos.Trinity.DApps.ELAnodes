import { Component, OnInit } from '@angular/core';
import { Native } from '../../services/native.service';


@Component({
    selector: 'app-wallets',
    templateUrl: './wallets.page.html',
    styleUrls: ['./wallets.page.scss'],
})
export class WalletsPage implements OnInit {

    constructor(
        public native: Native
    ) {}

    ngOnInit() {
        console.log('Wallets Set: ' + this.lang)
    }

    public lang: string = 'English'

    walletsChoice(event) {
        this.lang = event.detail.value
        console.log('Wallets Set: ' + this.lang)
    }
}