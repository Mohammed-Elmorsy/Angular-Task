import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: "root",
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  //get http call to get response from the API
  getCharacterByName(name: string) {
    return this.http.get(environment.baseURL + name);
  }
}
