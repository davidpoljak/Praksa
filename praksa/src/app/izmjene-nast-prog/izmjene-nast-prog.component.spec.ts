import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzmjeneNastProgComponent } from './izmjene-nast-prog.component';

describe('IzmjeneNastProgComponent', () => {
  let component: IzmjeneNastProgComponent;
  let fixture: ComponentFixture<IzmjeneNastProgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzmjeneNastProgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IzmjeneNastProgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
