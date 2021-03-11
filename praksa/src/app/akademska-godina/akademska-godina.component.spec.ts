import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AkademskaGodinaComponent } from './akademska-godina.component';

describe('AkademskaGodinaComponent', () => {
  let component: AkademskaGodinaComponent;
  let fixture: ComponentFixture<AkademskaGodinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AkademskaGodinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AkademskaGodinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
