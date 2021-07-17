import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import Swal from 'sweetalert2';
import { Representante } from './representantesEjemplo';
import { RepresentanteService } from './administrarrepresentantes.service';
@Component({
  selector: 'app-administrarrepresentantes',
  templateUrl: './administrarrepresentantes.component.html'
})
export class AdministrarrepresentantesComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE ADMINISTRAR REPRESENTANTE-----------------------*/
  servicio: Representante[];
  servicio2: Representante = new Representante();
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  tipo = {};
  ListaPersonas : Persona[];
  PersEjemplo : Persona;

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: RepresentanteService ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private PersonaServicio : PersonaService
  ){ 
  
  }

  ngOnInit() {

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.addForm2 = this.formBuilder.group({
      alumnoCedula: ['', Validators.required],
      alumnoNombre: ['', Validators.required],
      alumnoApellido: ['', Validators.required],
      alumnoEmail: ['', Validators.required],
      alumnoTelefono: ['', Validators.required],
      alumnoDireccion: ['', Validators.required]
    });
 
    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR LOS REPRESENTANTES-----------------------*/
    this.listarRepresentantes();

    /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA LISTAR TODAS LAS PERSONAS Y ALMACENAMOS-----------------------*/
    this.PersonaServicio.getPersonas().subscribe(
      servicio => this.ListaPersonas = servicio
    );

  }


  showDialog() {
    this.dis = true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE REPRESENTANTES. EL METÓDO PARA LISTAR TODOS LOS REPRESENTANTES Y ALMACENAMOS-----------------------*/
  listarRepresentantes(){
    this.servicioService.getRepresentantes().subscribe(
      servicio => this.servicio = servicio
    );
  }

  /*-----------------------MÉTODOS PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
  get alumnoCedula(){return this.addForm2.get('alumnoCedula');}
  get alumnoNombre(){return this.addForm2.get('alumnoNombre');}
  get alumnoApellido(){return this.addForm2.get('alumnoApellido');}
  get alumnoEmail(){return this.addForm2.get('alumnoEmail');}
  get alumnoTelefono(){return this.addForm2.get('alumnoTelefono');}
  get alumnoDireccion(){return this.addForm2.get('alumnoDireccion');}

  /*-----------------------LLAMAMOS AL SERVICIO DE REPRESENTANTES. EL METÓDO PARA BUSCAR UN REPRESENTANTES MEDIANTE EL ID-----------------------*/
  cargarServicio(servicio:Representante): void {
    this.addForm2.reset();
    localStorage.setItem("alumId", servicio.padrId.toString());
    let servId = localStorage.getItem('alumId');
    this.servicioService.getRepresentante(+servId)
    .subscribe(data =>{

      this.servicio2 = data;
      this.alumnoCedula.setValue(this.servicio2.padrFkPersona.persCedula+"");
      this.alumnoNombre.setValue(this.servicio2.padrFkPersona.persNombre+"");
      this.alumnoApellido.setValue(this.servicio2.padrFkPersona.persApellido+"");
      this.alumnoEmail.setValue(this.servicio2.padrFkPersona.persEmail+"");
      this.alumnoTelefono.setValue(this.servicio2.padrFkPersona.persTelefono+"");
      this.alumnoDireccion.setValue(this.servicio2.padrFkPersona.persDireccion+"");
      this.dis = true;
      console.log(this.servicio2.padrFkPersona.persCedula);
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA ACTUALIZAR LA PERSONA DE ESE REPRESENTANTE-----------------------*/
  public update(): void {
    for (let index = 0; index < this.ListaPersonas.length; index++) {
      if(this.servicio2.padrFkPersona.persCedula == this.ListaPersonas[index].persCedula){
        this.PersEjemplo= this.ListaPersonas[index];
      }
    }
    this.servicio2.padrRepresentante
    this.PersEjemplo.persDireccion = this.addForm2.get("alumnoDireccion").value;
    this.PersEjemplo.persEmail = this.addForm2.get("alumnoEmail").value;
    this.PersEjemplo.persTelefono = this.addForm2.get("alumnoTelefono").value;
    this.PersEjemplo.persNombre = this.addForm2.get("alumnoNombre").value;
    this.PersEjemplo.persApellido = this.addForm2.get("alumnoApellido").value;
    this.PersonaServicio.update(this.PersEjemplo).subscribe( data =>{
      Swal.fire(
        'Actualizado Existosamente',
         `Se actualizo la información correctamente.`,
      "success")
      this.listarRepresentantes();
      this.dis = false;
    });
  }

}
