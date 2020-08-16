import { ResponseMock } from "./../models/responseMock";
import { TestBed, getTestBed } from "@angular/core/testing";
import { PeopleService } from "./people.service";
import { HttpClientModule } from "@angular/common/http";

describe("PeopleService", () => {
  let service: PeopleService;
  const responseMock: ResponseMock = {
    count: 0,
    next: "",
    previous: "",
    results: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PeopleService],
    });

    service = TestBed.get(PeopleService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#getCharacterByName should return data as expected", () => {
    it("should return results array", (done) => {
      service.getCharacterByName("g").subscribe((data: ResponseMock) => {
        expect(data.results).toBeTruthy();     
        done();
      });
    }); 

    it("should return count of characters", (done) => {
      service.getCharacterByName("g").subscribe((data: ResponseMock) => {
        expect(data.count).toBeTruthy();     
        done();
      });
    }); 


    it("should return count greater than or equals zero", (done) => {
      service.getCharacterByName("g").subscribe((data: ResponseMock) => {
        expect(data.count).toBeGreaterThanOrEqual(0);
        done();
      });
    });



  });
});
