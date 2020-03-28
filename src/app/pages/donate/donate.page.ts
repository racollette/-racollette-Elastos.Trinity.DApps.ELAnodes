import { Component, OnInit } from '@angular/core';
import { Native } from '../../services/native.service';


@Component({
    selector: 'app-donate',
    templateUrl: './donate.page.html',
    styleUrls: ['./donate.page.scss'],
})
export class DonatePage implements OnInit {

    constructor(
        public native: Native
    ) {}

    ngOnInit() {
    }

    close() {
        
    }
}