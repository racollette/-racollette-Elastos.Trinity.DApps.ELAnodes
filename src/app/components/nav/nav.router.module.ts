import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent
  }
];

// const routes: Routes = [
//   {
//     path: 'tabs',
//     component: NavComponent,
//     children: [
//       {
//         path: 'tab-home',
//         children: [
//           {
//             path: '',
//             loadChildren: './tab-home/tab-home.module#TabHomePageModule'
//           }
//         ]
//       },
//       {
//         path: 'tab-setting',
//         children: [
//           {
//             path: '',
//             loadChildren: './tab-setting/tab-setting.module#TabSettingPageModule'
//           }
//         ]
//       },
//       {
//         path: '',
//         redirectTo: '/tabs/tab-home',
//         pathMatch: 'full'
//       }
//     ]
//   },
//   {
//     path: '',
//     redirectTo: '/tabs/tab-home',
//     pathMatch: 'full'
//   }
// ];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}