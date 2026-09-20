import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the home page', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet shell', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
