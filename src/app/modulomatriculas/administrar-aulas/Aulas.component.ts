import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Aula} from './Aulaservicio';
import { administaraulaservice } from './Aulas.service';
@Component({
  selector: 'app-servicioslista',
  templateUrl: './Aulas.component.html'
 
})
export class AulasComponent implements OnInit {

  servicio: Aula[];
  private servicio2: Aula = new Aula();

  files: TreeNode[];
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  showDialog() {
    this.dis = true;
  }
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: administaraulaservice ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

 

  ngOnInit() {
    this.nodeService.getFilesystem().then(files => this.files = files);
    this.addForm2 = this.formBuilder.group({
      tipe_id: ['', Validators.required],
      tipe_serviciop: ['', Validators.required],
      tipe_descripcion: ['', Validators.required]
    });
 
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );


  }

  public create(): void {
    this.servicioService.create(this.servicio2).subscribe(
      Response => {
        this.dis = false;
        window.location.reload();

      }
    )
  }

  delete(servicio:Aula): void {

    this.servicioService.delete(servicio.aulaId).subscribe(
      response => {
        this.servicio = this.servicio.filter(servi => servi !== servicio)
      }
    )
  }

  cargarServicio(servicio:Aula): void {
    localStorage.setItem("servId", servicio.aulaId.toString());
    let servId = localStorage.getItem('servId');
    this.servicioService.getServicio(+servId).subscribe((data) =>
    this.servicio2 = data)
    this.dis = true;

  }


  public update(): void {
    this.servicioService.update(this.servicio2)
      .subscribe(cliente => {
        this.dis = false;
        window.location.reload();
      }
      )
  }
}