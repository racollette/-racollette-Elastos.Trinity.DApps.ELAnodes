import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    public version = "1.0.0";
    public commitVersion = "v0.0.1";

    constructor(
    ) {}

    ngOnInit() {
    }

    // init() {
    //     this.walletManager.getVersion((data) => {
    //         this.spvVersion = data;
    //     });
    // }
}