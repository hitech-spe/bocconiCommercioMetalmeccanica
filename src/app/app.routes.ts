import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AboutComponent} from './components/about/about.component';
import {ServicesComponent} from './components/services/services.component';
import {ContactComponent} from './components/contact/contact.component';
import {ServiceDetailComponent} from './components/service-detail/service-detail.component';
import {PrivacyComponent} from "./components/privacy/privacy.component";
import {TermsComponent} from "./components/terms/terms.component";

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {
        path: 'home', component: HomeComponent,
        children: [
            // NUOVO: Permette di aprire la modale sopra la Home!
            {path: 'services/:id', component: ServiceDetailComponent}
        ]
    },
    {path: 'about', component: AboutComponent},
    {
        path: 'services',
        component: ServicesComponent,
        children: [
            {path: ':id', component: ServiceDetailComponent}
        ]
    },
    {path: 'contact', component: ContactComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'termini', component: TermsComponent},
    {path: 'terms', redirectTo: '/termini'},
    {path: '**', redirectTo: '/home'}
];
