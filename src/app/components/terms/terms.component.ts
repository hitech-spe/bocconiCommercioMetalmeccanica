import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit, OnDestroy {
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
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
    this.translate.get(['SEO.TERMS_TITLE', 'SEO.TERMS_DESC']).subscribe(res => {
      this.titleService.setTitle(res['SEO.TERMS_TITLE']);
      this.metaService.updateTag({ name: 'description', content: res['SEO.TERMS_DESC'] });
    });
  }
}
