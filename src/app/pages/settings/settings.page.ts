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
      route: "/tabs/language",
      label: "Language",
      label_zh: "语言",
      icon: "md-globe",
    }
  ];

  storage = [
    {
      route: "/tabs/wallets",
      label: "Wallets",
      label_zh: "皮夹",
      icon: "wallet",
    },
  ];

  about = [
    {
      route: "/tabs/about",
      label: "About",
      label_zh: "关于",
      icon: "md-alert",
      note: "v1.0",
    },
    {
      route: "/tabs/tutorial",
      label: "Tutorial",
      label_zh: "讲解",
      icon: "md-photos",
    },
    {
      route: "/tabs/faq",
      label: "F.A.Q.",
      label_zh: "常问问题",
      icon: "help-circle",
    },
    {
      route: "/tabs/donate",
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
