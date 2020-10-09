import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, AUTOCOMPLETE_PANEL_HEIGHT } from '@angular/material';

import { ContactlistComponent } from '../contacDetails/contactlist.component'

import { IContact } from '../model/contact';
import { ContactService } from '../services/contact.service';
import { DBOperation } from '../shared/DBOperation';
import { Global } from '../shared/Global';

@Component({
  selector: 'app-contactform',
  templateUrl: './contactform.component.html',
  styleUrls: ['./contactform.component.css']
})

export class ContactformComponent implements OnInit {
  msg: string;
  indLoading = false;
  contactFrm: FormGroup;
  // dbops: DBOperation;
  // modalTitle: string;
  // modalBtnTitle: string;
  listFilter: string;
  selectedOption: string;
  // contact: IContact;
  genders = [];
  technologies = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _contactService: ContactService,
    public dialogRef: MatDialogRef<ContactlistComponent>) { }

  ngOnInit() {
    // built contact form
    this.contactFrm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      company: ['', [Validators.required, Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      lastDateContacted: ['', [Validators.required]]
    });
       // subscribe on value changed event of form to show validation message
    this.contactFrm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    if (this.data.dbops === DBOperation.create) {
      this.contactFrm.reset();
    } else {
      this.contactFrm.setValue(this.data.contact);
    }
    this.SetControlsState(this.data.dbops === DBOperation.delete ? false : true);
  }
  // form value change event
  onValueChanged(data?: any) {
    if (!this.contactFrm) { return; }
    const form = this.contactFrm;
    // tslint:disable-next-line:forin
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      // setup custom validation message to form
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  // form errors model
  // tslint:disable-next-line:member-ordering
  formErrors = {
    'name': '',
    'company': '',
    'phone': '',
    'address': '',
    'email': '',
    'lastDateContacted': ''
  };
  // custom valdiation messages
  // tslint:disable-next-line:member-ordering
  validationMessages = {
    'name': {
      'maxlength': 'Name cannot be more than 50 characters long.',
      'required': 'Name is required.'
    },
    'phone': {
      'phone': 'only numbers.',
      'required': 'phone is required.'
    },
    'company': {
      'required': 'company is required.'
    },
    'email': {
      'required': 'email is required.'
    },
    'lastDateContacted': {
      'required': 'lastDateContacted is required.'
    },
    'address': {
      'required': 'address is required.'
    }

  };
  onSubmit(formData: any) {
    const contactData = this.mapDateData(formData.value);
    switch (this.data.dbops) {
      case DBOperation.create:
        this._contactService.addContact(Global.BASE_USER_ENDPOINT + 'addContact', contactData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case DBOperation.update:
        this._contactService.updateContact(Global.BASE_USER_ENDPOINT + 'updateContact', contactData.id, contactData).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
      case DBOperation.delete:
        this._contactService.deleteContact(Global.BASE_USER_ENDPOINT + 'deleteContact', contactData.id).subscribe(
          data => {
            // Success
            if (data.message) {
              this.dialogRef.close('success');
            } else {
              this.dialogRef.close('error');
            }
          },
          error => {
            this.dialogRef.close('error');
          }
        );
        break;
    }
  }
  SetControlsState(isEnable: boolean) {
    isEnable ? this.contactFrm.enable() : this.contactFrm.disable();
  }

  mapDateData(contact: IContact): IContact {
    contact.lastDateContacted = new Date(contact.lastDateContacted).toISOString();
    return contact;
  }
}
