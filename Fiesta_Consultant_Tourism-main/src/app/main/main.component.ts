import { Component } from '@angular/core';
import { NavbardropdownComponent } from "../navbardropdown/navbardropdown.component";
import { RouterOutlet } from '@angular/router';
import { CardsliderComponent } from '../cardslider/cardslider.component';
import { CityComponent } from "../city/city.component";
import { CardsComponent } from '../cards/cards.component';


@Component({
  selector: 'app-main',
  imports: [NavbardropdownComponent, RouterOutlet, CardsliderComponent, CityComponent, CardsComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
