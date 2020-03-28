import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
    selector: 'nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    constructor(public zone: NgZone, public changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
    }

    changeTabs() {
        this.zone.run(() => {
            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
        });
    }
}