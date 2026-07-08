import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./shared/header/header.component";
import {SpinnerComponent} from "./shared/spinner/spinner.component";
import {FooterComponent} from "./shared/footer/footer.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent
  ],
  standalone: true
})
export class AppComponent {
  title = 'hi-tech';

  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);

  constructor() {
    this.translate.setDefaultLang('it');
    this.translate.use('it');
    this.updateHtmlLang(this.translate.currentLang || 'it');

    this.translate.onLangChange.subscribe(event => {
      this.updateHtmlLang(event.lang);
    });
  }

  private updateHtmlLang(lang: string) {
    const html = this.document.documentElement;
    if (html) {
      html.setAttribute('lang', lang);
    }
  }
}
