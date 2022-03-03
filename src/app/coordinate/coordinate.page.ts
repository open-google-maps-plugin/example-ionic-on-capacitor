import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {
  MapView,
  Marker,
  LatLng,
  ILatLng,
  IPoint,
  Projection,
} from '@open-google-maps-plugin/core';

@Component({
  selector: 'map-coordinate',
  templateUrl: './coordinate.page.html',
  styleUrls: ['./coordinate.page.scss'],
})
export class CoordinatePage implements AfterViewInit, OnDestroy {

  @ViewChild('mapCanvas') mapRef: ElementRef;
  map: MapView;
  @ViewChild('origin') originRef: ElementRef;
  originMarker: Marker;
  @ViewChild('destination') destRef: ElementRef;
  destMarker: Marker;
  @ViewChild('svgTag') svgTagRef: ElementRef;

  _onRedraw: () => void = () => this.redraw();

  svgLeft: string = `0px`;
  svgTop: string = `0px`;
  svgWidth: string = `0px`;
  svgHeight: string = `0px`;
  animateValues: string = "0,0; 100,100";
  animateToY: number = 0;

  constructor() { }

  ngAfterViewInit() {
    this.map = this.mapRef.nativeElement;
    this.originMarker = this.originRef.nativeElement;
    this.destMarker = this.destRef.nativeElement;


    this.map.addEventListener('ready', () => this.onMapReady(), {
      once: true
    });

  }

  ngOnDestroy() {

    this.map.removeEventListener('bounds_changed', this._onRedraw);
    this.originMarker.removeEventListener('position_changed', this._onRedraw);
    this.destMarker.removeEventListener('position_changed', this._onRedraw);
  }
  onMapReady() {

    // Fits the camera to the given bounds
    this.map.fitBounds([
      {"lat": 40.712216, "lng": -74.22655},
      {"lat": 40.773941, "lng": -74.12544}
    ]);

    this.originMarker.setPosition({"lat": 40.712216, "lng": -74.22655});
    this.destMarker.setPosition({"lat": 40.773941, "lng": -74.12544});

    this.svgTagRef.nativeElement.unpauseAnimations();

    this.map.addEventListener('bounds_changed', this._onRedraw);
    this.originMarker.addEventListener('position_changed', this._onRedraw);
    this.destMarker.addEventListener('position_changed', this._onRedraw);
  }

  redraw() {
    this.svgTagRef.nativeElement.pauseAnimations();
    const origin: LatLng = this.originMarker.getPosition();
    const dest: LatLng = this.destMarker.getPosition();

    const originPx: IPoint = this.map.fromLatLngToContainerPixel(origin);
    const destPx: IPoint = this.map.fromLatLngToContainerPixel(dest);

    const left: number = Math.min(originPx.x, destPx.x);
    const top: number = Math.min(originPx.y, destPx.y);
    const width: number = Math.max(originPx.x, destPx.x) - left;
    const height: number = Math.max(originPx.y, destPx.y) - top;

    this.svgLeft = `${ left }px`;
    this.svgTop = `${ top }px`;
    this.svgWidth = `${ width }px`;
    this.svgHeight = `${ height }px`;

    let animateFromX: number = 0;
    let animateToX: number = width;
    if (originPx.x >= destPx.x) {
      animateFromX = width;
      animateToX = 0;
    }
    let animateFromY: number = 0;
    let animateToY: number = height;
    if (originPx.y >= destPx.y) {
      animateFromY = height;
      animateToY = 0;
    }
    this.animateValues = `${ animateFromX },${ animateFromY }; ${ animateToX },${ animateToY }`;
    this.svgTagRef.nativeElement.unpauseAnimations();
  }

}
