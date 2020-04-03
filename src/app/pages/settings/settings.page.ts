import { Component, OnInit, NgZone } from '@angular/core';
import { Native } from '../../services/native.service';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from 'src/app/services/data.service';

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(public native: Native,
    public translate: TranslateService,
    public data: DataService,
    private navController: NavController
  ) { }

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

  public lang: string;

  ngOnInit() {
  }

  ionViewWillEnter() {
    titleBarManager.setTitle(this.translate.instant('settings-title'))
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
    titleBarManager.setNavigationMode(TitleBarPlugin.TitleBarNavigationMode.BACK);
    appManager.setListener((ret) => {this.onMessageReceived(ret)});
    this.lang = this.data.language
  }

  onMessageReceived(ret: AppManagerPlugin.ReceivedMessage) {
    if (ret.message == "navback") {
      this.navController.back();
    }
  }

  ionViewDidEnter() {
  }

  general = [
    {
      route: "/language",
      label: "Language",
      label_zh: "语言",
      icon: "md-globe",
    }
  ];

  storage = [
    {
      route: "/wallets",
      label: "Wallets",
      label_zh: "皮夹",
      icon: "wallet",
    },
  ];

  about = [
    {
      route: "/about",
      label: "About",
      label_zh: "关于",
      icon: "md-alert",
      note: "v1.0",
    },
    {
      route: "/intro",
      label: "Tutorial",
      label_zh: "讲解",
      icon: "md-photos",
    },
    {
      route: "/faq",
      label: "F.A.Q.",
      label_zh: "常问问题",
      icon: "help-circle",
    },
    {
      route: "/donate",
      label: "Donate",
      label_zh: "捐",
      icon: "thumbs-up",
    },
  ];

  public goWebsite() {
    this.native.openUrl("https://starfish-supernode.tech");
  }

  public goSocial(link: string) {
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
