import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Alumno} from './AdministrarAlumnoservicio';
import { AdministrarAlumnosservice } from './AdministrarAlumno.service';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-servicioslista',
  templateUrl: './AdministrarAlumno.component.html'
 
})
export class AdministraralumnosComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE ADMINISTRAR ALUMNO-----------------------*/
  servicio: Alumno[];
  servicio2: Alumno = new Alumno();
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};
  ListaPersonas : Persona[];
  PersEjemplo : Persona;
  
  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(  
    private activatedRoute: ActivatedRoute,
    private servicioService: AdministrarAlumnosservice ,
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
 
    /*-----------------------LLAMAMOS AL METÓDO PARA LISTAR LOS ALUMNOS-----------------------*/
    this.listarAlumnos();

    /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA LISTAR TODAS LAS PERSONAS Y ALMACENAMOS-----------------------*/
    this.PersonaServicio.getPersonas().subscribe(
      servicio => this.ListaPersonas = servicio
    );
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE ALUMNOS. EL METÓDO PARA LISTAR TODOS LOS ALUMNOS Y ALMACENAMOS-----------------------*/
  listarAlumnos(){
    this.servicioService.getServicios().subscribe(
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

  /*-----------------------LLAMAMOS AL SERVICIO DE ALUMNOS. EL METÓDO PARA ELIMINAR UN ALUMNO MEDIANTE EL ID-----------------------*/
  delete(servicio:Alumno): void {
    for (let index = 0; index < this.ListaPersonas.length; index++) {
      if(servicio.alumFkPersona.persCedula == this.ListaPersonas[index].persCedula){
        this.PersEjemplo= this.ListaPersonas[index];
      }
    }
    Swal.fire({
      title:'Eliminar Alumno',
      text: `¿Seguro que desea eliminar a ${servicio.alumFkPersona.persNombre} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        this.servicioService.delete(servicio.alumId).subscribe(
          response => {
            this.servicio = this.servicio.filter(servi => servi !== servicio)
            this.PersonaServicio.delete(this.PersEjemplo.persid).subscribe(
              response => {
                this.ListaPersonas = this.ListaPersonas.filter(person => person !== this.PersEjemplo)
                Swal.fire(
                'Alumno Eliminado',
                'alumno eliminado satisfactoriamente.',
                'success');
               }
            )
          }
        )
      }
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE ALUMNOS. EL METÓDO PARA BUSCAR UN ALUMNO MEDIANTE EL ID-----------------------*/
  cargarServicio(servicio:Alumno): void {
    this.addForm2.reset();
    localStorage.setItem("alumId", servicio.alumId.toString());
    let servId = localStorage.getItem('alumId');
    this.servicioService.getServicio(+servId)
    .subscribe(data =>{

      this.servicio2 = data;
      this.alumnoCedula.setValue(this.servicio2.alumFkPersona.persCedula+"");
      this.alumnoNombre.setValue(this.servicio2.alumFkPersona.persNombre+"");
      this.alumnoApellido.setValue(this.servicio2.alumFkPersona.persApellido+"");
      this.alumnoEmail.setValue(this.servicio2.alumFkPersona.persEmail+"");
      this.alumnoTelefono.setValue(this.servicio2.alumFkPersona.persTelefono+"");
      this.alumnoDireccion.setValue(this.servicio2.alumFkPersona.persDireccion+"");
      this.dis = true;
      console.log(this.servicio2.alumFkPersona.persCedula);
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA ACTUALIZAR LA PERSONA DE ESE ALUMNO-----------------------*/
  public update(): void {
    for (let index = 0; index < this.ListaPersonas.length; index++) {
      if(this.servicio2.alumFkPersona.persCedula == this.ListaPersonas[index].persCedula){
        this.PersEjemplo= this.ListaPersonas[index];
      }
    }
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
      this.listarAlumnos();
      this.dis = false;
    });
  }
}