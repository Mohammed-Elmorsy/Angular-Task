import { Component } from '@angular/core';
import { PeopleService } from './core/services/people.service';
import { Character } from './core/models/character';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularTask';
  charactersByName:Character[]; //array to hold the characters returned from API to loop in
  characterName:string = ''; //two way binded with input inner text
  loading:boolean; // to use in showing or hiding the loading image gif
  charactersCount:number; // to use in showing or hiding the characters not found image

  constructor(private peopleService:PeopleService){} //injecting the sevice to call the API 

  searchCharactersByName(){
    this.loading = true;
    this.peopleService.getCharacterByName(this.characterName).subscribe(res =>{
      this.charactersByName = res['results']; //retrieving results array from response object into charactersByName field array
      this.charactersCount = res['count']; //retrieving count property from response object into count field 
      this.loading = false;
      console.log(res);
    },
    err =>{
      console.log(err);
      alert('some error occured in retrieving data');
      this.loading = false;
    })
  }

}
