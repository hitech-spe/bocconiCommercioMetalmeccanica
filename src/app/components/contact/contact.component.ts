import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {Title, Meta} from "@angular/platform-browser";
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
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
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
    this.translate.get(['SEO.CONTACT_TITLE', 'SEO.CONTACT_DESC']).subscribe(res => {
      this.titleService.setTitle(res['SEO.CONTACT_TITLE']);
      this.metaService.updateTag({ name: 'description', content: res['SEO.CONTACT_DESC'] });
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
