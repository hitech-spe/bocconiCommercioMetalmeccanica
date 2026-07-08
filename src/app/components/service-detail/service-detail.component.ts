import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {Location} from "@angular/common";
import {Title, Meta} from "@angular/platform-browser";

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  fullContent: string;
  translations?: {
    [locale: string]: {
      title: string;
      description: string;
      features: string[];
      fullContent: string;
    }
  };
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss'],
  imports: [
    RouterLink,
    TranslateModule
  ],
  standalone: true
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  service: Service | undefined;
  private langChangeSub: Subscription | undefined;

  private services: Service[] = [
    {
      id: 'soccorso-stradale',
      title: 'Soccorso Stradale',
      icon: '🚨',
      description: 'Intervento rapido per soccorso stradale di auto, furgoni e veicoli industriali.',
      features: ['Assistenza 24/7', 'Recupero veicoli incidentati', 'Trasporto in officina', 'Intervento rapido'],
      fullContent: 'Il servizio di soccorso stradale BOCCONI COMMERCIO e METALMECCANICA SRL garantisce un intervento tempestivo e sicuro per il recupero di veicoli in avaria o incidentati.',
      translations: {
        en: {
          title: 'Roadside Assistance',
          description: 'Fast response for roadside assistance of cars, vans, and industrial vehicles.',
          features: ['24/7 Assistance', 'Recovery of crashed vehicles', 'Transport to workshop', 'Fast response'],
          fullContent: 'BOCCONI COMMERCIO e METALMECCANICA SRL roadside assistance service ensures a timely and safe response for the recovery of broken down or crashed vehicles.'
        }
      }
    },
    {
      id: 'lavaggio',
      title: 'Lavaggio Industriale e Auto',
      icon: '🚿',
      description: 'Servizio di lavaggio per auto e veicoli industriali.',
      features: ['Lavaggio esterni', 'Pulizia interni', 'Sanificazione', 'Lavaggio per mezzi pesanti'],
      fullContent: 'Offriamo un servizio completo di lavaggio e sanificazione per ogni tipologia di veicolo, dalle auto ai mezzi industriali.',
      translations: {
        en: {
          title: 'Industrial and Car Wash',
          description: 'Washing service for cars and industrial vehicles.',
          features: ['Exterior washing', 'Interior cleaning', 'Sanitization', 'Heavy vehicle washing'],
          fullContent: 'We offer a complete washing and sanitization service for all types of vehicles, from cars to industrial vehicles.'
        }
      }
    },
    {
      id: 'noleggio',
      title: 'Noleggio Auto, Furgoni e Mezzi da Lavoro',
      icon: '🔑',
      description: 'Soluzioni di mobilità flessibili e noleggio di auto, furgoni (anche 9 posti), gru, piattaforme aeree, escavatori e muletti per privati e aziende.',
      features: [
        'City Car / Utilitarie: Fiat Panda, Toyota Yaris. Perfette per la città, consumi bassi. Assicurazione e soccorso inclusi.',
        'SUV e Station Wagon: Jeep Renegade, Fiat 500X, Skoda Octavia. Comfort e spazio per la famiglia.',
        'Furgoni Merci e 9 Posti: Doblò, Ducato, Transit. Da 3 a 12mq, anche con gancio traino, ribaltabile e versioni passeggeri.',
        'Furgoni Frigo e Speciali: Per catering, fioristi e trasporti specifici. Preventivo personalizzato.',
        'Gru e Piattaforme Aeree: Mezzi di sollevamento per lavori in quota e cantieristica.',
        'Escavatori e Macchine Movimento Terra: Mezzi operativi professionali per ogni tipo di scavo.',
        'Muletti: Soluzioni per la logistica e la movimentazione merci in magazzino.',
        'Noleggio Lungo Termine (12-60 mesi): Tutto incluso (bollo, assicurazione, manutenzione, gomme) a canone fisso.'
      ],
      fullContent: 'Ampia flotta di mezzi recenti e sicuri per soddisfare le esigenze di privati e aziende. Che ti serva una piccola auto per la città, un furgone per il tuo lavoro o mezzi di sollevamento e macchine operatrici, offriamo formule dal breve al lungo termine con pacchetti tutto incluso per eliminare ogni pensiero.',
      translations: {
        en: {
          title: 'Car, Van and Work Equipment Rental',
          description: 'Flexible mobility solutions and rental of cars, vans (including 9-seaters), cranes, aerial platforms, excavators, and forklifts for individuals and companies.',
          features: [
            'City Cars / Hatchbacks: Fiat Panda, Toyota Yaris. Perfect for the city, low consumption. Insurance and recovery included.',
            'SUVs & Station Wagons: Jeep Renegade, Fiat 500X, Skoda Octavia. Comfort and space for the family.',
            'Cargo & 9-Seater Vans: Doblò, Ducato, Transit. From 3 to 12sqm, also with tow hook, tipper, and passenger versions.',
            'Fridge & Special Vans: For catering, florists, and specific transports. Personalized quote.',
            'Cranes and Aerial Platforms: Lifting equipment for high-altitude work and construction sites.',
            'Excavators and Earthmoving Machinery: Professional operating vehicles for any type of excavation.',
            'Forklifts: Solutions for logistics and goods handling in the warehouse.',
            'Long Term Rental (12-60 months): All-inclusive (tax, insurance, maintenance, tires) at a fixed rate.'
          ],
          fullContent: 'Large rental fleet of recent and safe vehicles to meet the needs of individuals and companies. Whether you need a small car for the city, a van for your work, or lifting equipment and operating machines, we offer short to long-term formulas with all-inclusive packages to eliminate all worries.'
        }
      }
    }
  ];

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.updateService(id);
    });

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      const id = this.route.snapshot.params['id'];
      this.updateService(id);
    });
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }

  private updateService(id: string): void {
    const rawService = this.services.find(s => s.id === id);
    if (rawService) {
      this.service = this.localizeService(rawService);
      this.updateSEO(this.service);
    }
  }

  private updateSEO(service: Service): void {
    const pageTitle = `${service.title} | Bocconi Srl`;
    this.titleService.setTitle(pageTitle);
    this.metaService.updateTag({ name: 'description', content: service.description });

    // Open Graph Social Tags
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: service.description });

    let imageFilename = 'aziendaBocconi.jpeg';
    if (service.id === 'soccorso-stradale') {
      imageFilename = 'soccorsoStradale.jpeg';
    } else if (service.id === 'lavaggio') {
      imageFilename = 'lavaggio.jpeg';
    } else if (service.id === 'noleggio') {
      imageFilename = 'noleggio.jpeg';
    }

    try {
      const origin = window.location.origin;
      this.metaService.updateTag({ property: 'og:image', content: `${origin}/assets/images/${imageFilename}` });
    } catch (e) {
      // Fallback in case window is not defined (SSR or similar)
      this.metaService.updateTag({ property: 'og:image', content: `assets/images/${imageFilename}` });
    }
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
  }

  private localizeService(service: Service): Service {
    const currentLang = this.translate.currentLang || 'it';
    if (currentLang === 'en' && service.translations?.['en']) {
      return {
        ...service,
        ...service.translations['en']
      };
    }
    return service;
  }

  closeModal(): void {
    this.location.back();
  }
}
