import { Component, inject, OnInit, OnDestroy, Input } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {SeoService} from "../../services/seo.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    TranslateModule,
    FormsModule,
    NgClass
  ],
  standalone: true
})
export class ContactComponent implements OnInit, OnDestroy {
  @Input() isNested = false;
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);
  private langSub?: Subscription;

  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  isSending = false;
  submitStatus: 'success' | 'error' | null = null;

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
    if (this.isNested) return;
    this.translate.get(['SEO.CONTACT_TITLE', 'SEO.CONTACT_DESC', 'SEO.CONTACT_KEYWORDS']).subscribe(res => {
      this.seoService.generateTags({
        title: res['SEO.CONTACT_TITLE'],
        description: res['SEO.CONTACT_DESC'],
        keywords: res['SEO.CONTACT_KEYWORDS'],
        url: '/contact'
      });
    });
  }

  onSubmit() {
    if (this.isSending) return;

    this.isSending = true;
    this.submitStatus = null;

    // Sostituisci questi valori con i tuoi di EmailJS
    const serviceID = 'service_5jj2lvy';
    const templateID = 'template_8t32238';
    const publicKey = 'T4VOkzWHLK-DBTx5_';

    emailjs.send(serviceID, templateID, this.formData, publicKey)
      .then((result: EmailJSResponseStatus) => {
        console.log('Email inviata con successo!', result.text);
        this.submitStatus = 'success';
        this.resetForm();
      }, (error) => {
        console.error('Errore durante l\'invio:', error.text);
        this.submitStatus = 'error';
      })
      .finally(() => {
        this.isSending = false;
      });
  }

  private resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
  }
}
