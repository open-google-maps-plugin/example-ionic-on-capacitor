import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import {
  MapView,
  Marker,
  LatLng,
  ILatLng,
  IPoint,
  Projection,
  InfoWindow
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

  @ViewChild('svgWrapper') svgWrapperRef: ElementRef;
  svgWrapper: HTMLDivElement;
  @ViewChild('svgTag') svgTagRef: ElementRef;
  svgTag: SVGElement;

  @ViewChild('infoDest') infoDestRef: ElementRef;
  infoDest: InfoWindow;
  @ViewChild('infoOrigin') infoOriginRef: ElementRef;
  infoOrigin: InfoWindow;

  svgLeft: string = `0px`;
  svgTop: string = `0px`;
  svgWidth: string = `0px`;
  svgHeight: string = `0px`;
  animateValues: string = "0,0; 100,100";
  animateToY: number = 0;

  _onRedraw: () => void = () => this.redraw();


  constructor() { }

  ngAfterViewInit() {
    this.infoOrigin = this.infoOriginRef.nativeElement;
    this.infoDest = this.infoDestRef.nativeElement;

    this.svgWrapper = this.svgWrapperRef.nativeElement;
    this.svgTag = this.svgTagRef.nativeElement;

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


    this.infoOrigin.open(this.originMarker);
    this.infoDest.open(this.destMarker);
    this.infoOrigin.addEventListener('click', (event: Event) => {
      this.infoOrigin.classList.add("animate__animated");
      this.infoOrigin.classList.toggle("animate__flip");
      setTimeout(() => {
        this.infoOrigin.classList.remove("animate__animated", "animate__flip");
      }, 1000);
    })

    this.infoDest.addEventListener('click', (event: Event) => {
      this.infoDest.classList.add("animate__animated", "animate__flip");
      setTimeout(() => {
        this.infoDest.classList.remove("animate__animated", "animate__flip");
      }, 1000);
    })

    // Fits the camera to the given bounds
    this.map.moveCamera({
      target: [
        {"lat": 40.712216, "lng": -74.22655},
        {"lat": 40.773941, "lng": -74.12544}
      ]
    });

    this.originMarker.setPosition({"lat": 40.712216, "lng": -74.22655});
    this.destMarker.setPosition({"lat": 40.773941, "lng": -74.12544});

    this.map.addEventListener('bounds_changed', this._onRedraw);
    this.originMarker.addEventListener('position_changed', this._onRedraw);
    this.destMarker.addEventListener('position_changed', this._onRedraw);
  }

  redraw() {
    const origin: LatLng = this.originMarker.getPosition();
    const dest: LatLng = this.destMarker.getPosition();

    const originPx: IPoint = this.map.fromLatLngToContainerPixel(origin);
    const destPx: IPoint = this.map.fromLatLngToContainerPixel(dest);

    const left: number = Math.min(originPx.x, destPx.x);
    const top: number = Math.min(originPx.y, destPx.y);
    const width: number = Math.max(originPx.x, destPx.x) - left;
    const height: number = Math.max(originPx.y, destPx.y) - top;

    this.svgWrapper.style.left = `${ left }px`;
    this.svgWrapper.style.top = `${ top }px`;
    this.svgWrapper.style.width = `${ width }px`;
    this.svgWrapper.style.height = `${ height }px`;

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

    this.svgWrapper.style.left = `${ left }px`;
    this.svgWrapper.style.top = `${ top }px`;
    this.svgWrapper.style.width = `${ width }px`;
    this.svgWrapper.style.height = `${ height }px`;
    this.animateValues = `${ animateFromX },${ animateFromY }; ${ animateToX },${ animateToY }`;

  }

}
