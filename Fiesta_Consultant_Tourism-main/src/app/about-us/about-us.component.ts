import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  visibleModal:
    | 'onSite'
    | 'preConference'
    | 'postConference'
    | 'corporate'
    | 'corporate2'
    | 'corporate3'
    | null = null;

  openModal(type: typeof this.visibleModal) {
    this.visibleModal = type;
  }

  closeModal() {
    this.visibleModal = null;
  }

  getModalTitle(): string {
    switch (this.visibleModal) {
      case 'onSite':
        return 'On-Site';
      case 'preConference':
        return 'Pre-Conference';
      case 'postConference':
        return 'Post-Conference';
      case 'corporate':
        return 'Corporate Events';
      case 'corporate2':
        return 'Conference & Seminar Management';
      case 'corporate3':
        return 'Product Launches & Brand Activation';
      default:
        return '';
    }
  }

  getListItems(): string[] {
    switch (this.visibleModal) {
      case 'onSite':
        return this.services1;
      case 'preConference':
        return this.services;
      case 'postConference':
        return this.services2;
      default:
        return [];
    }
  }

  getParagraphText(): string {
    switch (this.visibleModal) {
      case 'corporate':
        return `We are offering one-stop solutions for your all needs to cater corporate events, Team meets up, award ceremony or a small get together. The experience which we have earned over the past years shows our goodwill, we are known among one of the best corporate event management company. Our team makes sure to satisfy customer requirements fully, from stage fabrication to perfect lighting and sound. For every single event, our team tries their best to come up with amazing ideas, along with a pocket-friendly budget. Whether it's a team meet up plan, or any ceremony we can arrange all for you. Also, our main goal is to ensure smooth dealing, & friendly environment.`;
      case 'corporate2':
        return `We understand every little details and importance of your conference and seminars. So our team makes sure to work efficiently and pull out the successful event, whether its launch of a new brand to target potential client or to retain old clients, annual conference or any kind of informal meeting our team is ready to manage everything competently with no glitches.`;
      case 'corporate3':
        return `We become the major part for the existence of your brand, starting with the promotional activities to ensure that products reach out to a maximum number of targeted people. Brand activation and product launch purpose are to showcase their product, and to introduce them successfully in the market. We work efficiently to bring different ideas for your product, and to make sure that your brand stands out in the market with super hit image.`;
      default:
        return '';
    }
  }

  services: string[] = [
    'Overview of the requirement. Do the study on the same and come up with the most suitable venues and destination',
    'Explore the different travel essentials and the practice',
    'Providing support for people travelling internationally & domestically',
    'Offer insurance service if needed',
    'Coaching guide facility',
  ];

  services1: string[] = [
    'On arrival',
    'Welcome and guide on arrival.',
    'Signage: Indicating sign board, Placards/Standees, Registration sign up counters',
    'Audio visual is a must',
    'Customization as per client preference.',
    'Menu designing',
  ];

  services2: string[] = [
    'Beforehand conference tours',
    'Touring and certified instructor for better guiding',
    'Strong coordination for the departures',
    'Winding up the entire setup',
    'Full & Final billing settlement',
    'Provide final presentation to clients, so they may review the bills later on',
    'Overview program along with relevant details to the clients',
  ];
}
