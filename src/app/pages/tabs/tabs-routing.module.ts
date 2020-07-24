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
                    path: 'rewards',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../rewards/rewards.module#RewardsPageModule'
                            }
                        ]
                },
                {
                    path: 'analytics',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../analytics/analytics.module#AnalyticsPageModule'
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
                    path: 'notification',
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../notification/notification.module#NotificationPageModule'
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
