import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);

  private readonly siteUrl = 'https://bocconicommet.com';
  private readonly defaultImage = `${this.siteUrl}/assets/images/aziendaBocconi.jpeg`;

  /**
   * Generates and updates standard SEO meta tags, Open Graph (OG), and Twitter Cards.
   * Also updates the canonical link tag.
   */
  generateTags(config: SeoConfig): void {
    const title = config.title;
    const description = config.description;
    
    // Resolve absolute image URL
    let image = this.defaultImage;
    if (config.image) {
      if (config.image.startsWith('http')) {
        image = config.image;
      } else {
        // Strip leading slash if present
        const cleanImagePath = config.image.startsWith('/') ? config.image.substring(1) : config.image;
        image = `${this.siteUrl}/${cleanImagePath}`;
      }
    }

    // Resolve absolute canonical/OG page URL
    let url = this.siteUrl;
    if (config.url) {
      if (config.url.startsWith('http')) {
        url = config.url;
      } else {
        const cleanUrlPath = config.url.startsWith('/') ? config.url : `/${config.url}`;
        url = `${this.siteUrl}${cleanUrlPath}`;
      }
    }

    // 1. Title
    this.titleService.setTitle(title);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    
    const keywords = config.keywords || 'soccorso, massafra, vendita auto, furgoni, noleggio auto, bocconi srl, soccorso stradale, lavaggio industriale, noleggio furgoni, taranto, puglia';
    this.metaService.updateTag({ name: 'keywords', content: keywords });

    // 3. Open Graph (Facebook / LinkedIn)
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'BOCCONI COMMERCIO e METALMECCANICA SRL' });

    // 4. Twitter Cards
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    // 5. Canonical link URL
    this.updateCanonicalUrl(url);
  }

  /**
   * Updates or creates the link[rel='canonical'] tag in head.
   */
  private updateCanonicalUrl(url: string): void {
    if (!this.document) return;
    
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
