import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import moment from 'moment';
import { APP_DATE_FORMATS } from 'src/app/app.constants';
import { IDateFilter, IOptionDateFilter } from 'src/app/interface/data';
import { DateAdapterService } from 'src/app/services/date-adapter.service';

@Component({
  selector: 'app-date-filter[options]',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: DateAdapterService },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
})
export class DateFilterComponent implements OnInit {
  @Input() defaultFilterType!: string;
  @Output() onSubmitFilter = new EventEmitter<any>();
  @Input() options!: IOptionDateFilter[];

  public currentFilterType!: string;

  public dateFilterForm = new FormGroup({
    filterType: new FormControl<string>(''),
    from: new FormControl<Date | null>(null),
    to: new FormControl<Date | null>(null),
  });

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.currentFilterType = this.defaultFilterType
      ? this.defaultFilterType
      : this.options[0].value;
    const filterType = this.dateFilterForm.get('filterType');
    filterType?.setValue(this.currentFilterType);
    filterType?.valueChanges.subscribe({
      next: (value) => {
        this.currentFilterType = value ?? '';
        const fromControl = this.dateFilterForm.get('from')
        const toControl = this.dateFilterForm.get('to')
        
        if (this.currentFilterType === 'between') {
          this.dateFilterForm.controls.from.addValidators([
            Validators.required,
          ]);
          this.dateFilterForm.controls.to.addValidators([Validators.required]);
        } else {
          fromControl?.clearValidators()
          toControl?.clearValidators()
        }
        fromControl?.updateValueAndValidity()
        toControl?.updateValueAndValidity()
      },
    });
  }

  submitFilter() {
    if (!this.dateFilterForm.valid) {
      this._snackBar.open('Заполните все поля!', 'Ок', {
        duration: 2000,
      });
    }
    this.onSubmitFilter.emit(this.dateFilterForm.value)
  }
}
