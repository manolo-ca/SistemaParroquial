import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Calendario} from './CalendarioUsuario';
import { Calendarioservice} from './CalendarioUsuario.service';

@Component({
  selector: 'app-servicioslista',
  templateUrl: './calendarioUsuario.component.html'
 
})

export class ClendarioUsuarioComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE CALENDARIO USUARIO-----------------------*/
  servicio: Calendario[];
  addForm2: FormGroup;

  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: Calendarioservice ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
  ){ 

  }

  ngOnInit() {
    
    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.addForm2 = this.formBuilder.group({
      tipe_id: ['', Validators.required],
      tipe_serviciop: ['', Validators.required],
      tipe_evento: ['', Validators.required],
      tipe_descripcion: ['', Validators.required]
    });
 
    /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA LISTAR TODOS LOS EVENTOS Y ALMACENAMOS-----------------------*/
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );
  }

}