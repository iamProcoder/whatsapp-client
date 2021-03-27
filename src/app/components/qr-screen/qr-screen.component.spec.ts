import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrScreenComponent } from './qr-screen.component';

describe('QrScreenComponent', () => {
  let component: QrScreenComponent;
  let fixture: ComponentFixture<QrScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
