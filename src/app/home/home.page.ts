import {Component, OnInit} from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  mapRef = null;

  constructor(private loadingController: LoadingController,
              private geolocation: Geolocation) {}

  ngOnInit(): void {
    this.loadMap();
  }

  async loadMap() {
    const loading = await this.loadingController.create();
    loading.present();


    const myLatLng = await this.getLocation();

    const mapEle: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      loading.dismiss();
      this.addMarker(myLatLng.lat, myLatLng.lng);
    });
  }

  private addMarker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      zoom: 8,
      map: this.mapRef,
      title: 'Mark my location!'
    });
  }

  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
      lat: rta.coords.latitude,
      lng: rta.coords.longitude
    };
  }

}
