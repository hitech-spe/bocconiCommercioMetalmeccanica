import { Component, inject, HostListener } from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    TranslateModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  standalone: true
})
export class HeaderComponent {
  isMenuOpen = false;
  currentLang: string;


  isUserMenuOpen = false;

  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang || 'it';
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click')
  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  logout() {
    this.closeMenu();
    this.isUserMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    this.closeMenu();
  }
}
