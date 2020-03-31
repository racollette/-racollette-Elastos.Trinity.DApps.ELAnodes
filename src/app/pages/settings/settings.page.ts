
import { Component, OnInit, NgZone } from '@angular/core';
import { Native } from '../../services/native.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

    constructor(
        public native: Native
    ) {}

    // public masterWalletId: string = "1";
    // public masterWalletType: string = "";
    // public readonly: string = "";
    // public currentLanguageName: string = "";
    // public isShowDeposit: boolean = false;
    // public fee: number = 0;
    // public feePerKb: number = 10000;
    // public walletInfo = {};
    // public password: string = "";
    // public available = 0;

    general = [ 
      {
        route: "/language",
        label: "Language",
        icon: "md-globe",
      }
    ];

    data = [ 
      {
        route: "/wallets",
        label: "Wallets",
        icon: "wallet",
      },
    ];

    about = [ 
      {
        route: "/about",
        label: "About",
        icon: "md-alert",
        note: "v1.0",
      },
       {
        route: "/intro",
        label: "Tutorial",
        icon: "md-photos",
      },
      {
        route: "/intro",
        label: "F.A.Q.",
        icon: "help-circle",
      },
      {
        route: "/donate",
        label: "Donate",
        icon: "thumbs-up",
      },
    ];

    public goWebsite() {
        this.native.openUrl("https://starfish-supernode.tech");
    }

    public goSocial(link: string) {
        console.log('clicked')
        this.native.openUrl(link);
    }

}



















// import { Component, OnInit, ViewChild } from '@angular/core';
// import { IonInput } from '@ionic/angular';

// import { NodesService } from 'src/app/services/nodes.service';
// import { Node } from 'src/app/models/nodes.model';


// @Component({
//   selector: 'app-settings',
//   templateUrl: './settings.page.html',
//   styleUrls: ['./settings.page.scss'],
// })
// export class SettingsPage implements OnInit {

//   @ViewChild('settings', {static: false}) settings: IonInput;

//   // settings values
//   public filteredNodes: Node[] = [];
//   public _node: string = '';

//   // Node Detail
//   public showNode: boolean = false;
//   public nodeIndex: number;
//   public node: Node;

//   constructor(
//     public nodesService: NodesService,
//   ) {}

//   ngOnInit() {
//   }

//   ionViewDidEnter() {
//     setTimeout(() => {
//       this.settings.setFocus();
//     }, 200);
//   }

//   //// setting ////
//   filterNodes(settings: string): any {
//     this.filteredNodes = this.nodesService._nodes.filter((node) => {
//       if (!settings) {
//         return;
//       } else {
//         return node.Nickname.toLowerCase().indexOf(settings.toLowerCase()) !== -1;
//       }
//     });
//     console.log('settings results', this.filteredNodes);
//   }

//   //// Define Values ////
//   getVotes(votes): string {
//     const fixedVotes: number = parseInt(votes);
//     return fixedVotes.toLocaleString().split(/\s/).join(',');
//   }

//   getVotePercent(votes): string {
//     const votePercent: number = parseFloat(votes) / this.nodesService.totalVotes * 100;
//     return votePercent.toFixed(2);
//   }

//   //// Node Detail ////
//   _showNode(index: number, node: Node) {
//     this.showNode = !this.showNode;
//     this.nodeIndex = index;
//     this.node = node;
//   }

//   return() {
//     this.showNode = false;
//   }
// }
