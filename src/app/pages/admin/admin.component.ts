import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ApplicationsService } from '../../services/applications.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ButtonModule, SelectModule, FormsModule, SlicePipe],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  allApplications: any[] = [];
  filtered: any[] = [];
  paginated: any[] = [];

  filterStatus = '';
  filterRoom = '';
  sortDir: 'asc' | 'desc' = 'desc';

  page = 1;
  pageSize = 5;
  get totalPages() { return Math.ceil(this.filtered.length / this.pageSize); }

  statusOptions = [
    { label: 'Все статусы', value: '' },
    { label: 'Новая', value: 'new' },
    { label: 'Мероприятие назначено', value: 'assigned' },
    { label: 'Мероприятие завершено', value: 'completed' },
  ];

  roomOptions = [
    { label: 'Все помещения', value: '' },
    { label: 'Аудитория', value: 'auditorium' },
    { label: 'Коворкинг', value: 'coworking' },
    { label: 'Кинозал', value: 'cinema' },
  ];

  changeOptions = [
    { label: 'Новая', value: 'new' },
    { label: 'Мероприятие назначено', value: 'assigned' },
    { label: 'Мероприятие завершено', value: 'completed' },
  ];

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
    private auth: AuthService,
    private msg: MessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.appsSvc.getAll().subscribe({
      next: (data) => {
        this.allApplications = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  applyFilters() {
    let result = [...this.allApplications];
    if (this.filterStatus) result = result.filter(a => a.status === this.filterStatus);
    if (this.filterRoom)   result = result.filter(a => a.room_type === this.filterRoom);
    result.sort((a, b) => {
      const da = new Date(a.conference_date).getTime();
      const db = new Date(b.conference_date).getTime();
      return this.sortDir === 'asc' ? da - db : db - da;
    });
    this.filtered = result;
    this.page = 1;
    this.updatePage();
  }

  updatePage() {
    const start = (this.page - 1) * this.pageSize;
    this.paginated = this.filtered.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }

  toggleSort() {
    this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  prevPage() { if (this.page > 1) { this.page--; this.updatePage(); } }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.updatePage(); } }

  changeStatus(app: any, newStatus: string) {
    this.appsSvc.updateStatus(app.id, newStatus).subscribe({
      next: (updated: any) => {
        app.status = updated.status;
        this.msg.add({ severity: 'success', summary: 'Статус обновлён' });
        this.applyFilters();
      },
      error: () => this.msg.add({ severity: 'error', summary: 'Ошибка обновления' }),
    });
  }

  logout() { this.auth.logout(); }
}
