import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

import { EmployeesService } from '../../services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  loader = false;
  dataSource = [];
  map: any;
  displayedColumns = ['image', 'fullName', 'email', 'phone', 'address'];

  constructor(private employeesService: EmployeesService) { }

  ngOnInit(): void {
    this.loader = true;
    // get employees data from service and transform
    this.employeesService.getEmployeesData()
      .subscribe(({ results }) => {
        this.dataSource = results.map(({ name: { title, first, last }, email, phone, location, picture: {thumbnail}}) => {
          return {
            fullName: `${title} ${first} ${last}`,
            email,
            phone,
            location,
            thumbnail,
          };
        });
        this.setMap();
      }, error => this.loader = false, () => this.loader = false);
  }

  setMap(): void {
    // set locations
    const points = [];
    this.dataSource.map(({ fullName, location: {coordinates, street, city, state, country} }) => {
      points.push({fullName, location: [coordinates.latitude, coordinates.longitude], street, city, state, country});
    });

    // create marker points
    const features = points.map(res => {
      const feature = new Feature({geometry: new Point(olProj.fromLonLat(res.location))});
      feature.setStyle(
        new Style({
          image: new Icon(({
            anchor: [0.5, 1.8],
            src: 'http://cdn.mapmarker.io/api/v1/pin?text=P&size=50&hoffset=1'
          })),
          text: new Text({
            font: '20px Calibri,sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({
              color: '#fff', width: 3
            }),
            text: `${res.fullName}: \n ${res.street.number} ${res.street.name}, \n ${res.city}, ${res.state}, ${res.country}`,
          })
        }),
      );
      return feature;
    });

    const vectorSource = new VectorSource({
      features: [...features],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // init map
    this.map = new Map({
      target: 'employees_map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer,
      ],
      view: new View({
        center: olProj.fromLonLat([0, 0]),
        zoom: 1
      })
    });
  }
}
