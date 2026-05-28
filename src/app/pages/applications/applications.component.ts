import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { ApplicationsService } from '../../services/applications.service';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, TextareaModule, RouterLink, SlicePipe],
  templateUrl: './applications.component.html',
})
export class ApplicationsComponent implements OnInit, OnDestroy {
  applications: any[] = [];
  reviewForm: FormGroup;
  reviewDialogVisible = false;
  selectedAppId: number | null = null;

  // Слайдер
  slides = [
    { bg: '#1e3a5f', title: 'Аудитория', desc: 'Вместимость до 200 человек' },
    { bg: '#2d5016', title: 'Коворкинг', desc: 'Современное рабочее пространство' },
    { bg: '#5c1a1a', title: 'Кинозал', desc: 'Профессиональное оборудование' },
    { bg: '#1a3d5c', title: 'Конференц-зал', desc: 'Для деловых переговоров' },
  ];
  currentSlide = 0;
  private sliderInterval: any;

  statusLabels: Record<string, string> = {
    new: 'Новая',
    assigned: 'Мероприятие назначено',
    completed: 'Мероприятие завершено',
  };
  roomLabels: Record<string, string> = {
    auditorium: 'Аудитория',
    coworking: 'Коворкинг',
    cinema: 'Кинозал',
  };
  paymentLabels: Record<string, string> = {
    cash: 'Наличными',
    transfer: 'Перевод по номеру телефона',
  };

  constructor(
    private appsSvc: ApplicationsService,
    private reviewsSvc: ReviewsService,
    private auth: AuthService,
    private fb: FormBuilder,
    private msg: MessageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.reviewForm = this.fb.group({
      review_text: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.load();
    this.sliderInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.cdr.detectChanges();
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.sliderInterval);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  load() {
    this.appsSvc.getMy().subscribe({
      next: (data) => { this.applications = data; this.cdr.detectChanges(); },
      error: (err) => console.error(err),
    });
  }

  canLeaveReview(app: any): boolean {
    return app.status !== 'new' && !app.review_text;
  }

  openReviewDialog(appId: number) {
    this.selectedAppId = appId;
    this.reviewForm.reset();
    this.reviewDialogVisible = true;
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.selectedAppId) return;
    this.reviewsSvc.create({
      application_id: this.selectedAppId,
      review_text: this.reviewForm.value.review_text,
    }).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Отзыв отправлен' });
        this.reviewDialogVisible = false;
        this.load();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Ошибка при отправке отзыва' }),
    });
  }

  logout() { this.auth.logout(); }
}
