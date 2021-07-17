import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Dirigentes} from './Dirigenteservicio';
import { administardirigenteservice } from './Dirigentes.service';
@Component({
  selector: 'app-servicioslista',
  templateUrl: './Dirigentes.component.html'
 
})
export class DirigentesComponent implements OnInit {

  servicio: Dirigentes[];
  private servicio2: Dirigentes = new Dirigentes();

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
    private servicioService: administardirigenteservice ,
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

  delete(servicio:Dirigentes): void {

    this.servicioService.delete(servicio.dirigenteId).subscribe(
      response => {
        this.servicio = this.servicio.filter(servi => servi !== servicio)
      }
    )
  }

  cargarServicio(servicio:Dirigentes): void {
    localStorage.setItem("servId", servicio.dirigenteId.toString());
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