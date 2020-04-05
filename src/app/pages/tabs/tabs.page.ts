import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

declare let appManager: any;

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

    constructor(
        public router: Router
    ) { }

    ngOnInit() { }

}