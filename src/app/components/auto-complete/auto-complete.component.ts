import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { startWith, map } from 'rxjs';
@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css',
})
export class AutoCompleteComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() options: any[] = [];
  @Input() label: string | null = null;
  @Output() optionSelected = new EventEmitter<any>();
  filteredOptions: any[] = [];
  userHasTyped = false;
  ngOnInit(): void {
    if (this.control) {
      this.control.valueChanges
        .pipe(
          startWith(''),
          map((value) => this.filter(value))
        )
        .subscribe(
          (filteredOptions) => (this.filteredOptions = filteredOptions)
        );
    }
  }

  onUserInput(){
    this.userHasTyped = true
  }
  filter(query: string): any[] {
    return this.options.filter((option) =>
      option.nomRecette.toLowerCase().includes(query.toLowerCase())
    );
  }

  selectOption(option: any) {
    this.optionSelected.emit(option);
    this.userHasTyped = false;
    this.control.setValue(option.nomRecette);
    this.filteredOptions = [];
  }
}
