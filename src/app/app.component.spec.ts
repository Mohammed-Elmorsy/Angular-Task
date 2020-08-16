import { SortablejsModule } from "node_modules/ngx-sortablejs/esm2015/lib/sortablejs.module.js";
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { PeopleService } from "./core/services/people.service";
import { FormsModule } from "@angular/forms";
import { DebugElement, Component } from "@angular/core";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>; //reference to the component with additonal helping methods
  let debugElement: DebugElement; //to get a reference to fixture elements
  let htmlElement: HTMLElement;
  let peopleServiceMock: any; //fake service

  //function to get an html element by css selector
  function getOneHtmlElement(selector: string): HTMLElement {
    debugElement = fixture.debugElement.query(By.css(selector));
    if (debugElement) {
      htmlElement = debugElement.nativeElement;
      return htmlElement;
    } else {
      return null;
    }
  }

  //configuration before all tests
  beforeEach(async(() => {
    peopleServiceMock = jasmine.createSpyObj("PeopleService", [
      "getCharacterByName",
    ]);
    peopleServiceMock.getCharacterByName.and.returnValue(
      of([
        {
          count: 0,
          next: "",
          previous: "",
          results: [],
        },
      ])
    );
    TestBed.configureTestingModule({
      //testing module
      imports: [
        FormsModule,
        SortablejsModule.forRoot({ animation: 150 }),
        RouterTestingModule,
      ],
      declarations: [AppComponent],
      providers: [{ provide: PeopleService, useValue: peopleServiceMock }],
    }).compileComponents();
  }));

  //before each test coming
  beforeEach(() => {
    // Arrange
    fixture = TestBed.createComponent(AppComponent); //testing version of app component
    component = fixture.componentInstance; //instance of that component
  });

  //html elments
  describe("Checking app creation and html elements required", () => {
    it("should create the app", () => {
      // Assert
      expect(component).toBeTruthy();
    });

    it(`should have title as 'AngularTask'`, () => {
      expect(component.title).toEqual("AngularTask");
    });

    it("should include an input", () => {
      expect(getOneHtmlElement("input")).toBeTruthy();
    });

    it('should include an input with type = "search"', () => {
      expect(getOneHtmlElement("input").getAttribute("type")).toEqual("search");
    });

    it("should have cards when there are characters returned", () => {
      // Act
      component.charactersByName = [
        { name: "abc", height: "150", homeworld: "dddd", url: "http://reg" },
      ];
      fixture.detectChanges();
      // Assert
      expect(getOneHtmlElement(".card")).toBeTruthy();
    });

    it("should have no cards when there are no characters returned", () => {
      component.charactersCount = 0;
      fixture.detectChanges();
      expect(getOneHtmlElement(".card")).toBeFalsy();
    });

    it('should have "no characters found img" when there are no characters returned', () => {
      component.charactersCount = 0;
      fixture.detectChanges();
      expect(getOneHtmlElement("#notFoundImg")).toBeTruthy();
    });

    it('should not have "no characters found img" when there are characters returned', () => {
      component.charactersCount = 4;
      fixture.detectChanges();
      expect(getOneHtmlElement("#notFoundImg")).toBeFalsy();
    });

    it('should not have "loading img" when not retrieving data from API', () => {
      component.loading = false;
      fixture.detectChanges();
      expect(getOneHtmlElement("#loadingImg")).toBeFalsy();
    });

    // when loading data from API
    describe("when loading data from API", () => {
      it('should have the "loading img" when getting data from API', () => {
        component.loading = true;
        fixture.detectChanges();
        expect(getOneHtmlElement("#loadingImg")).toBeTruthy();
      });

      it('should not have the "no characters found img" when getting data from API', () => {
        component.loading = true;
        fixture.detectChanges();
        expect(getOneHtmlElement("#notFoundImg")).toBeFalsy();
      });

      it("should not have any cards when getting data from API", () => {
        component.loading = true;
        component.charactersByName = [
          { name: "abc", height: "150", homeworld: "dddd", url: "http://reg" },
        ];
        fixture.detectChanges();
        expect(getOneHtmlElement(".card")).toBeFalsy();
      });
    });
  });

  //events
  describe("Checking events", () => {
    it("should call #searchCharactersByName function when search button is clicked", () => {
      spyOn(component, "searchCharactersByName");
      getOneHtmlElement("#searchBtn").click();
      fixture.detectChanges();
      expect(component.searchCharactersByName).toHaveBeenCalled();
    });
  });

  // checking searchCharactersByName function
  describe("#searchCharactersByName function works as expected", () => {

    it("should call #getCharacterByName function from people service once", () => {
      component.searchCharactersByName();
      expect(peopleServiceMock.getCharacterByName).toHaveBeenCalledTimes(1);
    });  

    it("should retrieve results array into charactersByName array", (done) => {
      component.searchCharactersByName();
      peopleServiceMock.getCharacterByName("g").subscribe((data) => {
        expect(data.results).toEqual(component.charactersByName);    
        done();
      });   
    }); 

    it("should retrieve count into charactersCount field", (done) => {
      component.searchCharactersByName();
      peopleServiceMock.getCharacterByName("g").subscribe((data) => {
        expect(data.count).toEqual(component.charactersCount);     
        done();
      });   
    });

  });
}); //end of app component describe
