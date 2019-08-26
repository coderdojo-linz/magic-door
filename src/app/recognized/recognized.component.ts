import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recognized',
  templateUrl: './recognized.component.html',
  styleUrls: ['./recognized.component.scss']
})
export class RecognizedComponent implements OnInit {

  faceId: string;
  name: string;
  confidence: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(map => {
      this.faceId = map.get('faceId');
      this.name = map.get('name');
      this.confidence = parseFloat(map.get('confidence'));
    });
  }
}
