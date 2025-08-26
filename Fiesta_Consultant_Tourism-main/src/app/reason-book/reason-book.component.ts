import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reason-book',
  imports: [CommonModule],
  templateUrl: './reason-book.component.html',
  styleUrl: './reason-book.component.css',
})
export class ReasonBookComponent {
  features = [
    {
      icon: 'fa-shield',
      color: 'text-orange-400',
      title: 'BEST PRICE GUARANTEE',
    },
    {
      icon: 'fas fa-comments',
      color: 'text-green-500',
      title: '24X7 LIVE CHAT SUPPORT',
    },
    { icon: 'fa-bookmark', color: 'text-blue-500', title: 'FAST BOOKING' },
    { icon: 'fas fa-star', color: 'text-red-500', title: '5 STAR FACILITIES' },
    { icon: 'fa-wifi', color: 'text-orange-400', title: 'WIFI COMING SOON' },
  ];

  description = `Pakistan is a land of diverse landscapes, rich culture, and ancient heritage waiting to be explored. From the snow-capped peaks of the north to the golden deserts of the south, every region offers a unique experience. Tourists can enjoy breathtaking valleys like Hunza and Swat, or explore historical cities like Lahore, Multan, and Peshawar. The country's vibrant festivals, traditional cuisines, and warm hospitality make every journey memorable. With its religious sites, mountain trails, serene lakes, and coastal views, Pakistan is an ideal destination for adventurers and peace seekers alike. At Fiesta Consultant, we aim to make your travel comfortable, safe, and unforgettable. Discover the unseen beauty of Pakistan with us — your trusted travel partner.`;
}
