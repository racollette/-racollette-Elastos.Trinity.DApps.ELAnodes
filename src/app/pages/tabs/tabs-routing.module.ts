import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'vote',
          children:
            [
              {
                path: '',
                loadChildren: '../vote/vote.module#VotePageModule'
              }
            ]
        },
        {
          path: 'history',
          children:
            [
              {
                path: '',
                loadChildren: '../history/history.module#HistoryPageModule'
              }
            ]
        },
        {
          path: 'stats',
          children:
            [
              {
                path: '',
                loadChildren: '../stats/stats.module#StatsPageModule'
              }
            ]
        },
           {
          path: 'settings',
          children:
            [
              {
                path: '',
                loadChildren: '../settings/settings.module#SettingsPageModule'
              }
            ]
        },
         {
          path: 'tutorial',
          children:
            [
              {
                path: '',
                loadChildren: '../tutorial/tutorial.module#TutorialPageModule'
              }
            ]
        },
        {
          path: 'about',
          children:
            [
              {
                path: '',
                loadChildren: '../about/about.module#AboutPageModule'
              }
            ]
        },
        {
          path: 'language',
          children:
            [
              {
                path: '',
                loadChildren: '../language/language.module#LanguagePageModule'
              }
            ]
        },
        {
          path: 'faq',
          children:
            [
              {
                path: '',
                loadChildren: '../faq/faq.module#FAQPageModule'
              }
            ]
        },
        {
          path: 'wallets',
          children:
            [
              {
                path: '',
                loadChildren: '../wallets/wallets.module#WalletsPageModule'
              }
            ]
        },
        {
          path: 'donate',
          children:
            [
              {
                path: '',
                loadChildren: '../donate/donate.module#DonatePageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/vote',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/vote',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule { }
