import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { LoadingService } from "../../services/loading.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { Title, Meta } from "@angular/platform-browser";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private langSub?: Subscription;

  isLoginMode = true;
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  error = '';
  success = '';
  isLoading = false;

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
    this.translate.get(['SEO.LOGIN_TITLE', 'SEO.LOGIN_DESC']).subscribe(res => {
      this.titleService.setTitle(res['SEO.LOGIN_TITLE']);
      this.metaService.updateTag({ name: 'description', content: res['SEO.LOGIN_DESC'] });
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    this.success = '';
    this.firstName = '';
    this.lastName = '';
  }

  async onSubmit() {
    if (this.isLoading) return;
    this.error = '';
    this.success = '';

    if (!this.isLoginMode) {
      if (!this.firstName || !this.lastName) {
        this.error = 'AUTH.ERROR_REQUIRED_FIELDS';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.error = 'AUTH.ERROR_MATCH';
        return;
      }
    }

    this.isLoading = true;
    this.loadingService.show();

    try {
      if (this.isLoginMode) {
        await this.authService.login(this.email, this.password);
        await this.router.navigate(['/home']);
      } else {
        await this.authService.register(this.email, this.password, this.firstName, this.lastName);
        this.success = 'AUTH.SUCCESS_REGISTER';
        this.isLoginMode = true;
        this.password = '';
        this.confirmPassword = '';
        this.firstName = '';
        this.lastName = '';
      }
    } catch (err: any) {
      console.error(err);
      this.error = err.message || 'AUTH.ERROR_GENERIC';
    } finally {
      this.isLoading = false;
      this.loadingService.hide();
    }
  }
}
