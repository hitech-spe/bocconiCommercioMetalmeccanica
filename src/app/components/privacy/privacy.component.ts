import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);
  private langSub?: Subscription;

  get currentLang(): string {
    return this.translate.currentLang || 'it';
  }

  ngOnInit(): void {
    this.updateSEO();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.updateSEO();
    });
  }

  ngOnDestroy(): void {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  private updateSEO(): void {
    this.translate.get(['SEO.PRIVACY_TITLE', 'SEO.PRIVACY_DESC', 'SEO.PRIVACY_KEYWORDS']).subscribe(res => {
      this.seoService.generateTags({
        title: res['SEO.PRIVACY_TITLE'],
        description: res['SEO.PRIVACY_DESC'],
        keywords: res['SEO.PRIVACY_KEYWORDS'],
        url: '/privacy'
      });
    });
  }
}
