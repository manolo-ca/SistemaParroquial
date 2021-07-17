import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import { CursilloBautizo } from '../administrarCBautizo/administrarcbautizo';
import { CursilloBautizoService } from '../administrarCBautizo/administrarcbautizo.service';

@Component({
  selector: 'app-cursillo-pre-bautismal',
  templateUrl: './cursilloBautizo.component.html'
})

export class cursilloBautizoComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DEL REGISTRO DE CURSILLO PRE-BAUTISMAL-----------------------*/
  FormCursillo: FormGroup;
  submitted1 = false;
  cols: any[];
  
  date8 : Date;
  datecursillo : Date;

  cursilloBautizo : CursilloBautizo;

  PersonasLista : Persona[];
  Personabautizo : Persona = new Persona();
  PersonaMadre :Persona = new Persona();
  PersonaPadre : Persona = new Persona();

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(private nodeService: NodeService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private PersonaServicio : PersonaService,
    private CursilloBautizoService : CursilloBautizoService
  ){

  }

  ngOnInit() {

    /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA LISTAR TODAS LAS PERSONAS Y ALMACENAMOS-----------------------*/
    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;
    });

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.FormCursillo = this.formBuilder.group({
      bautizocedula: ['', Validators.required],
      bautizoNombre: ['', Validators.required],
      bautizoApellido: ['', Validators.required],
      bautizoNacimmiento: ['', Validators.required],
      bautizoDireccion: ['', Validators.required],
      padreCedula: ['', Validators.required],
      padreNombre: ['', Validators.required],
      padreApellido: ['', Validators.required],
      madreCedula: ['', Validators.required],
      madreNombre: ['', Validators.required],
      madreApellido: ['', Validators.required],
      cursilloLugar: [''],
      cursilloHora: ['', Validators.required],
      fechaCursillo: ['', Validators.required],
    });

  }

  /*-----------------------MÉTODO PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
  get bautizocedula(){return this.FormCursillo.get('bautizocedula');}
  get bautizoNombre(){return this.FormCursillo.get('bautizoNombre');}
  get bautizoApellido(){return this.FormCursillo.get('bautizoApellido');}
  get bautizoNacimmiento(){return this.FormCursillo.get('bautizoNacimmiento');}
  get padreCedula(){return this.FormCursillo.get('padreCedula');}
  get padreNombre(){return this.FormCursillo.get('padreNombre');}
  get padreApellido(){return this.FormCursillo.get('padreApellido');}
  get madreCedula(){return this.FormCursillo.get('madreCedula');}
  get madreNombre(){return this.FormCursillo.get('madreNombre');}
  get madreApellido(){return this.FormCursillo.get('madreApellido');}
  get cursilloLugar(){return this.FormCursillo.get('cursilloLugar');}
  get cursilloHora(){return this.FormCursillo.get('cursilloHora');}
  get fechaCursillo(){return this.FormCursillo.get('fechaCursillo');}

  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA-----------------------*/
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
      return persona.persCedula==cedula; 
    });
  }
  
  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA Y ALMACENAR EN PERSONA DEL BAUTIZO-----------------------*/
  findbyCedulaBautizo() {
    if (this.PersonasLista.includes(this.buscarCedula(this.FormCursillo.get('bautizocedula').value))){
      this.Personabautizo = this.buscarCedula(this.FormCursillo.get('bautizocedula').value);
    }else{
      Swal.fire({
        title:'Usuario no existe',
        text: `Desea registrar al usuario ${this.FormCursillo.get('bautizocedula').value} ?`,
        showDenyButton: true,
        confirmButtonText: `Aceptar`,
        denyButtonText: `Cancelar`,
      }).then((result)=>{
        if(result.isConfirmed){
          this.router.navigate(['/resgistro-personas']);
        }else if(result.isConfirmed){}
      })
    }
  }

  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA Y ALMACENAR EN PERSONA DE LA MADRE DEL BAUTIZO-----------------------*/
  findbyCedulaMadre() {
    if (this.PersonasLista.includes(this.buscarCedula(this.FormCursillo.get('madreCedula').value))){
      this.PersonaMadre = this.buscarCedula(this.FormCursillo.get('madreCedula').value);
    }else{
      Swal.fire({
        title:'Usuario no existe',
        text: `Desea registrar al usuario ${this.FormCursillo.get('madreCedula').value} ?`,
        showDenyButton: true,
        confirmButtonText: `Aceptar`,
        denyButtonText: `Cancelar`,
      }).then((result)=>{
        if(result.isConfirmed){
          this.router.navigate(['/resgistro-personas']);
        }else if(result.isConfirmed){}
      })
    }
  }

  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA Y ALMACENAR EN PERSONA DE LA PADRE DEL BAUTIZO-----------------------*/
  findbyCedulaPadre() {
    if (this.PersonasLista.includes(this.buscarCedula(this.FormCursillo.get('padreCedula').value))){
      this.PersonaPadre = this.buscarCedula(this.FormCursillo.get('padreCedula').value);
    }else{
      Swal.fire({
        title:'Usuario no existe',
        text: `Desea registrar al usuario ${this.FormCursillo.get('padreCedula').value} ?`,
        showDenyButton: true,
        confirmButtonText: `Aceptar`,
        denyButtonText: `Cancelar`,
      }).then((result)=>{
        if(result.isConfirmed){
          this.router.navigate(['/resgistro-personas']);
        }else if(result.isConfirmed){}
      })
    }
  }

  /*-----------------------METÓDO QUE CARGA TODOS LOS DATOS DEL CURSILLO PREVIAMENTE A GUARDAR-----------------------*/
  cargardatos(){
    this.cursilloBautizo = new CursilloBautizo();
    this.cursilloBautizo.cursbFecha = this.datecursillo;
    if(this.date8.getMinutes()==0){
      this.cursilloBautizo.cursbHora = this.date8.getHours()+":0"+this.date8.getMinutes();
    }else{
      this.cursilloBautizo.cursbHora = this.date8.getHours()+":"+this.date8.getMinutes();
    }
    this.cursilloBautizo.cursbNombreb = this.Personabautizo.persNombre + " " + this.Personabautizo.persApellido;
    this.cursilloBautizo.cursbNmadre = this.PersonaMadre.persNombre + " " + this.PersonaMadre.persApellido;
    this.cursilloBautizo.cursbNpadre = this.PersonaPadre.persNombre + " " + this.PersonaPadre.persApellido;
    this.cursilloBautizo.cursbLugar = "Parroquia San Joaquín";
    this.cursilloBautizo.cursbEstado=false;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-BAUTISMAL. EL METÓDO PARA ALMACENAR UN NUEVO CURSILLO-----------------------*/
  RegistrarCursillo(){
    if (this.FormCursillo.invalid) {
      Swal.fire(
        'Datos Erroneos',
        'Existe información erronea o campos vacios. Necesarios para el registro',
        'error'
      );
      return;
    }else{
      this.cargardatos();
      console.log(this.cursilloBautizo);
      this.CursilloBautizoService.createCursillo(this.cursilloBautizo).subscribe(data => {
        Swal.fire(
          'Cursillo Regustrado',
          'El registro se realizo correctamente',
          'success'
        );
        console.log("Cursillo creado Correctamente");
        this.FormCursillo.reset();
      });
    }
  }

}