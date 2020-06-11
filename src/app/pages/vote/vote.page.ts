import { Component, OnInit, Directive, ViewChild, Injectable, NgZone } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { NodesService } from 'src/app/services/nodes.service';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Native } from 'src/app/services/native.service';
import { StorageService } from 'src/app/services/storage.service';
import { DatatableComponent } from '@swimlane/ngx-datatable/esm2015/lib/components/datatable.component';
import { TranslateService } from '@ngx-translate/core';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'app-vote',
    templateUrl: './vote.page.html',
    styleUrls: ['./vote.page.scss'],
})

export class VotePage implements OnInit {

    @ViewChild('nodeTable', { static: false }) ngxDataTable: DatatableComponent;

    public input: number;
    public input1: number;
    public input2: number;
    public nodesSelected: string = '';
    public nodeTable: any;
    public input3: number;
    public voteDocument: any;

    public NA: number = 0;
    public SA: number = 0;
    public EU: number = 0;
    public AS: number = 0;
    public OC: number = 0;
    public AF: number = 0;

    public nodeLoad: any;

    public tableStyle: string = ''
    public address: string = '';

    // Node Selection
    public selectedCount: number = 0;
    public selected: string[] = [];
    public selectedARR: number = 0;
    public selectedAvgPay: number = 0;
    public selectedVotePercent: number = 0;

    // Intent
    public voted: boolean = false;
    public checked: boolean = true;

    // Slides
    public showDetails: boolean = false;
    public nodeIndex: number = 0;
    public node: any;

    public triggered: boolean = false;
    public atHome: boolean;

    constructor(
        public nodesService: NodesService,
        private router: Router,
        private data: DataService,
        private storageService: StorageService,
        private translate: TranslateService,
        private navController: NavController,
        private zone: NgZone,
        private native: Native,
        private modalController: ModalController,
    ) { }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.atHome = true;
        titleBarManager.setTitle(this.translate.instant('Supernodes'))
        appManager.setListener((ret) => { this.onMessageReceived(ret) });
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
            key: "back",
            iconPath: TitleBarPlugin.BuiltInIcon.BACK
        });
        titleBarManager.addOnItemClickedListener((menuIcon) => {
            if (menuIcon.key == "back") {
                if (this.showDetails) {
                    this.zone.run(() => {
                        this.showDetails = false;
                    });
                    return;
                }
                if (this.native.modalOpen) {
                    this.modalController.dismiss();
                    this.native.modalOpen = false;
                    return;
                }
                if (this.atHome) {
                    appManager.launcher();
                    return;
                }
                this.navController.back();
            }
        });
    }

    ionViewDidEnter() {
    }

    ionViewDidLeave() {
        this.showDetails = false;
        this.atHome = false;
    }

    // Node slider navigation handling
    _showDetails(index: number, node: Node) {
        this.showDetails = true;
        this.nodeIndex = index - 1;
        this.node = node;
    }

    onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
        if (ret.message == "navback" && this.showDetails) {
            this.zone.run(() => {
                this.showDetails = false;
            });
        } else {
            appManager.launcher();
        }
    }

    public pushMenu() {
        this.nodesService.nodesLoaded.subscribe(nodeLoad => this.nodeLoad = nodeLoad)
        this.data.currentselectedCount.subscribe(input => this.input = input)
        this.data.currentselectedARR.subscribe(input1 => this.input1 = input1)
        this.data.currentselectedAvgPay.subscribe(input2 => this.input2 = input2)
        this.data.currentselected.subscribe(nodesSelected => this.nodesSelected = nodesSelected)
        this.data.currentnodeTable.subscribe(nodeTable => this.nodeTable = nodeTable)
        this.data.currentvotePercent.subscribe(input3 => this.input3 = input3)
        this.data.currentvoteDocument.subscribe(voteDocument => this.voteDocument = voteDocument)
        this.data.NA_Count.subscribe(NA => this.NA = NA)
        this.data.NA_Count.subscribe(SA => this.SA = SA)
        this.data.NA_Count.subscribe(EU => this.EU = EU)
        this.data.NA_Count.subscribe(AS => this.AS = AS)
        this.data.NA_Count.subscribe(OC => this.OC = OC)
        this.data.NA_Count.subscribe(AF => this.AF = AF)

        this.voteDocument = document.querySelectorAll('.datatable-body-row');

        this.data.updateStats(this.selectedCount, this.selectedARR, this.selectedAvgPay, this.selected, this.ngxDataTable, this.selectedVotePercent, this.voteDocument)
        this.nodesService.nodeLoader(this.nodeLoad)

        this.simulateClick();
    }

    simulateClick() {
        this.triggered = true;
        let row: HTMLElement = document.getElementsByTagName("datatable-body-cell")[0] as HTMLElement;
        row.click();
        row.click();
    }

    updateNodes(event) {
        setTimeout(() => {
            this.nodesService.fetchNodes().then(() => {
                event.target.complete();
            });
        }, 2000);
    }

    deltaStatus(input) {
        let delta: number = Math.abs(parseInt(input))
        if (delta !== 0) {
            return delta.toLocaleString(undefined, { maximumFractionDigits: 0 })
        } else {
            return;
        }
    }

    // Shorten long supernode names tp fit table
    truncateNames(name) {
        if (name == "Cyber Republic Press CR新闻团队") {
            return "Cyber Republic Press"
        } else if (name == "Elastos Forest Node (EFN)") {
            return "Elastos Forest Node"
        } else if (name == "CR Regions Global Fund - Clarence Liu") {
            return "CR Regions Global Fund"
        } else if (name == "Orchard - Elastos Business Development") {
            return "Orchard Business Development"
        } else if (name == "Long ELA，Short the world(追风筝的人)") {
            return "Long ELA，Short the world"
        } else if (name == "Pmhee555 75% weekly payouts") {
            return "Pmhee555 75% payouts"
        } else {
            return name
        }
    }

    votePercent(row) {
        const votePercent: number = (parseFloat(row.Votes) / parseFloat(row.Totalvotes)) * 100
        return votePercent.toFixed(2) + '%'
    }

    formatVotes(votes) {
        const votesDisplay: string = ((parseFloat(votes)) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'M'
        return votesDisplay
    }

    arrPercent(arr) {
        const arrPercent: number = arr
        if (isNaN(arrPercent)) {
            let translation: string = this.translate.instant('table-no-data');
            return translation
        } else {
            return arrPercent + '%'
        }
    }

    payPercent(pay: string): string {
        const payPercent: number = parseFloat(pay)
        if (isNaN(payPercent)) {
            return
        } else {
            return payPercent.toFixed(0) + '%'
        }
    }

    onSelect({ selected }) {
        console.log(selected)

        this.voteDocument = document.querySelectorAll('.datatable-body-row');

        console.log('Select Event', selected, this.selected);
        this.selected.splice(0, this.selected.length);
        this.selected.push(selected);
        this.selectedCount = this.selected[0].length

        this.NA = 0;
        this.SA = 0;
        this.EU = 0;
        this.AS = 0;
        this.OC = 0;
        this.AF = 0;
        let checkedNodes: string[] = [];

        if (this.selectedCount > 0) {

            let sumARR: number = 0;
            let avgPay: number = 0;
            let votePercent: number = 0;

            let selectedArray: any[] = Object.values(this.selected[0])

            for (let i = 0; i < selectedArray.length; i++) {
                if (isNaN(parseFloat(selectedArray[i].AnnualROI))) {
                } else {
                    sumARR += parseFloat(selectedArray[i].AnnualROI)
                    avgPay += parseFloat(selectedArray[i].PercentPayout)
                    votePercent += (parseFloat(selectedArray[i].Votes) / parseFloat(selectedArray[i].Totalvotes)) * 100
                }

                if (selectedArray[i].Continent == 'North America') {
                    this.NA++
                }
                if (selectedArray[i].Continent == 'South America') {
                    this.SA++
                }
                if (selectedArray[i].Continent == 'Europe') {
                    this.EU++
                }
                if (selectedArray[i].Continent == 'Asia') {
                    this.AS++
                }
                if (selectedArray[i].Continent == 'Oceania') {
                    this.OC++
                }
                if (selectedArray[i].Continent == 'Africa') {
                    this.AF++
                }
                checkedNodes.push(selectedArray[i].Producer_public_key)
            }

            this.selectedARR = Number(sumARR.toFixed(3))
            this.selectedAvgPay = Number((avgPay / this.selectedCount).toFixed(2))
            this.selectedVotePercent = Number(votePercent.toFixed(2))

        } else {
            this.selectedARR = 0
            this.selectedAvgPay = 0
            this.selectedVotePercent = 0
        }

        //console.log(this.NA, this.SA, this.EU, this.AS, this.OC, this.AF)

        this.data.updateStats(this.selectedCount, this.selectedARR, this.selectedAvgPay, this.selected, this.ngxDataTable, this.selectedVotePercent, this.voteDocument)
        this.data.updateContinents(this.NA, this.SA, this.EU, this.AS, this.OC, this.AF)
        this.resetChecks(checkedNodes);
    }

    clearSelections() {
        let el = this.voteDocument

        for (let i = 0; i < el.length; i++) {
            el[i].className = '';
            el[i].classList.add("datatable-body-row");
        }

        //this.onSelect({selected: []});
        if (this.nodeTable) {
            this.nodeTable.selected = []
        }
    }

    resetChecks(checked) {
        this.nodesService._nodes.forEach(node => {
            if (checked !== undefined && checked.includes(node.Producer_public_key)) {
                node.isChecked = true;
            } else {
                node.isChecked = false;
            }
        })
    }

    onSliderCheck(node) {
        this.clearSelections()

        let el = this.voteDocument
        let checkedNode = []
        this.nodesService._nodes.forEach(node => {
            if (node.isChecked) {
                let index = node.Rank - 1
                checkedNode.push(node)
                el[index].classList.add("active");
            }
        })
        this.onSelect({ selected: checkedNode })
        this.ngxDataTable.selected = checkedNode
    }

}
