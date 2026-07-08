import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, inject, OnInit } from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {RouterOutlet} from "@angular/router";
import {AboutComponent} from "../about/about.component";
import {ServicesComponent} from "../services/services.component";
import {ContactComponent} from "../contact/contact.component";
import {Title, Meta} from "@angular/platform-browser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
    imports: [
        TranslateModule,
        AboutComponent,
        ServicesComponent,
        ContactComponent,
        RouterOutlet
    ],
  standalone: true
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private langSub?: Subscription;
  private host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  showBackToTop = false;

  ngOnInit(): void {
    this.updateSEO();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.updateSEO();
    });
  }

  private updateSEO(): void {
    this.translate.get(['SEO.HOME_TITLE', 'SEO.HOME_DESC']).subscribe(res => {
      this.titleService.setTitle(res['SEO.HOME_TITLE']);
      this.metaService.updateTag({ name: 'description', content: res['SEO.HOME_DESC'] });
    });
  }

  ngAfterViewInit(): void {
    const elements = this.host.nativeElement.querySelectorAll('.reveal-on-scroll') as NodeListOf<HTMLElement>;

    this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              this.observer?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -10% 0px'
        }
    );

    elements.forEach((element) => this.observer?.observe(element));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.showBackToTop = window.scrollY > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
