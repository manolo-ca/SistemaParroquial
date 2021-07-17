import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { Persona } from '../../registropersona/persona';
import { PersonaService } from '../../registropersona/persona.service';

@Component({
  selector: 'app-documentopersonas',
  templateUrl: './documentopersonas.component.html'
})
export class DocumentopersonasComponent implements OnInit {

  documentospersonas:Persona[];
  //********** CONSTRUCTOR PARA PARAMETROS Y RUTAS */ 
  constructor(
    private activatedRoute: ActivatedRoute,
    private personaService: PersonaService,
    private nodeService: NodeService,
    private router: Router,
     private formBuilder: FormBuilder
  ) { }

  //**********PERMITE INICIALIZAR EL COMPONENTE UNA VEZ HA RECIBIDO LA PROPIEDADES DE ENTRADA */ 
  ngOnInit() {
    
    this.personaService.getPersonas().subscribe(
      documentospersonas => this.documentospersonas = documentospersonas
    );
  }

}
