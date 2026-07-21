import { TestBed } from '@angular/core/testing';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let titleSpy: jasmine.SpyObj<Title>;
  let metaSpy: jasmine.SpyObj<Meta>;

  beforeEach(() => {
    const titleSpyObj = jasmine.createSpyObj('Title', ['setTitle']);
    const metaSpyObj = jasmine.createSpyObj('Meta', ['updateTag']);

    TestBed.configureTestingModule({
      providers: [
        SeoService,
        { provide: Title, useValue: titleSpyObj },
        { provide: Meta, useValue: metaSpyObj }
      ]
    });

    service = TestBed.inject(SeoService);
    titleSpy = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    metaSpy = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set title and meta tags correctly', () => {
    service.generateTags({
      title: 'Test Title',
      description: 'Test Description',
      url: '/test-route',
      keywords: 'keyword1, keyword2'
    });

    expect(titleSpy.setTitle).toHaveBeenCalledWith('Test Title');
    expect(metaSpy.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Test Description' });
    expect(metaSpy.updateTag).toHaveBeenCalledWith({ name: 'robots', content: 'index, follow' });
    expect(metaSpy.updateTag).toHaveBeenCalledWith({ name: 'keywords', content: 'keyword1, keyword2' });
    expect(metaSpy.updateTag).toHaveBeenCalledWith({ property: 'og:title', content: 'Test Title' });
    expect(metaSpy.updateTag).toHaveBeenCalledWith({ property: 'og:url', content: 'https://bocconicommet.com/test-route' });
  });

  it('should fallback to default keywords if none provided', () => {
    service.generateTags({
      title: 'Test Title',
      description: 'Test Description',
      url: '/test-route'
    });

    expect(metaSpy.updateTag).toHaveBeenCalledWith({ 
      name: 'keywords', 
      content: 'soccorso, massafra, vendita auto, furgoni, noleggio auto, bocconi srl, soccorso stradale, lavaggio industriale, noleggio furgoni, taranto, puglia' 
    });
  });
});
