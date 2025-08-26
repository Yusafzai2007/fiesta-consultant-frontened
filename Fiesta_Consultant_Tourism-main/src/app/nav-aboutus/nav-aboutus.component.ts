import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-aboutus',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav-aboutus.component.html',
  styleUrl: './nav-aboutus.component.css',
})
export class NavAboutusComponent {
  ngOnInit(): void {
    window.scrollTo(0, 0); // Scroll top pe reset hoga
  }

  services = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Quetta',
  'Multan',
  'Faisalabad',
  'Hyderabad',
  'Sialkot',
  'Bahawalpur',
  'Sukkur',
  'Murree',
  'Abbottabad'
]


paragraph: string =
  '  Why waste time on planning your tour to various destinations in Pakistan? You can be at peace of mind and let us take the worry of taking you around the country in style and hustle free. Pakistan Travel Tourism is one of a kind when it comes to providing the visitors with the best adventures in PKR. Who doesn\'t love mountains, historical sites, and culture altogether? If you find yourself in Pakistan may it be one day or a week, Pakistan Travel Tourism is always there to provide you the unsurpassed city tours. From the World of Adventures including Kund Malir, Neelum Valley, Hunza to themed parks including Sozo Water Park, Joyland, and Bahria Adventure Land, we offer the most thrilling and adventurous tours across Pakistan.';

paragraph2: string =
  '  Economical tours are our distinction and we are honored by it. Want to take a ride out of the city hustle and bustle? Pakistan Travel Tourism is offering one of the best deals in desert safaris and you can pick up the one that suits you. It includes morning, evening and night desert safari that come along with some variations containing jeep, camel, and VIP Desert Safari exclusively for you. We deliver only the unsurpassed services to our customers giving them once in a lifetime traveling experience they\'ll remember for their lifetime. The feedback of our customers is a testimony to that. With the satisfaction rate of 90% +/- we are leading from the front. We guarantee the clients of providing the highest quality experience with the lowest cost. So what\'s the wait for? Book one of our deals and live in the moment that you\'ll remember for your life and roam around anywhere in Pakistan with one of the best rated Holiday Packages that we offer. Feel free to contact our tour operators and organizers for any queries.';

text: { label: string }[] = [
  {
    label:
      'Our team of Pakistan Travel Tourism is obsessed with finding the best adventures and tours for you across Pakistan. From Lahore to Islamabad to Gilgit, from adventure tours to traditional, we guarantee a lifetime experience. Our customer feedback proves that we provide one of the best Holiday Packages Pakistan has ever offered.',
  },
  {
    label:
      'Planning to explore Pakistan with Pakistan Travel Tourism? Why start anywhere else than us. No doubt, we offer the most economical Pakistan tour packages for all our worthy customers. Moreover, Our Pakistan Excursions mix modern culture with history, adventure with natural beauty and local bazaars. You just have to visit Pakistan Travel Tourism on our website or contact our tour operators in Pakistan.',
  },
  {
    label:
      'Apart from Lahore Tour Packages, indeed we offer amazing packages for Islamabad, Murree, Hunza, and Swat too. From an action-packed jeep safari to traditional camping in the north, we deal in all holiday packages Pakistan has ever offered. Furthermore, we ensure a VIP protocol for all customers who book with us for Pakistan Excursions or any other city tour.',
  },
  {
    label:
      'In addition to that, many of our deals can’t be found anywhere else. Save time and book Pakistan Tour and Travels for entertaining yourself with great experiences at affordable prices. Moreover, our tour operators in Pakistan make sure at any rate that your booking process remains easy and comfortable.',
  },
  {
    label:
      'So what are you waiting for? Pakistan Travel Tourism or a tour anywhere in Pakistan from the best rated Holiday Packages Pakistan Travel Tourism has offered. Feel free to contact our tour operators in Pakistan for more details.',
  },
];

}
