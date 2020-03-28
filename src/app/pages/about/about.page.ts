import { Component, OnInit } from '@angular/core';
import { Native } from '../../services/native.service';


@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    public version = "1.0.0";
    public commitVersion = "v0.0.1";

    constructor(
        public native: Native
    ) {}

    ngOnInit() {
    }

    // init() {
    //     this.walletManager.getVersion((data) => {
    //         this.spvVersion = data;
    //     });
    // }

    goWebsite() {
        this.native.openUrl("https://starfish-supernode.tech");
    }

}