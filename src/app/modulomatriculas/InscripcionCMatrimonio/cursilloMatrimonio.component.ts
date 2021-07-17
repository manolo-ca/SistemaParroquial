import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import { CursilloMatrimonio } from '../administrarCMatrimonio/administrarcmatrimonio';
import { CursilloMatrimonioService } from '../administrarCMatrimonio/administrarcmatrimonio.service';

@Component({
  selector: 'app-cursillo-pre-matrimonial',
  templateUrl: './cursilloMatrimonio.component.html'
})

export class cursilloMatrimoniocomponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DEL REGISTRO DE CURSILLO PRE-MATRIMONIAL-----------------------*/
  FormCursillo: FormGroup;
  date8 : Date;
  datecursillo : Date;

  cursilloMatrimonio : CursilloMatrimonio;

  PersonasLista : Persona[];
  PersonaNovio: Persona = new Persona();
  PersonaNovia :Persona = new Persona();

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(private nodeService: NodeService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private PersonaServicio : PersonaService,
    private CursilloMatrimonioService : CursilloMatrimonioService
  ){

  }

  ngOnInit() {

    /*-----------------------LLAMAMOS AL SERVICIO DE PERSONAS. EL METÓDO PARA LISTAR TODAS LAS PERSONAS Y ALMACENAMOS-----------------------*/
    this.PersonaServicio.getPersonas().subscribe(data =>{
      this.PersonasLista = data;
    });

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.FormCursillo = this.formBuilder.group({
        novioCedula: ['', Validators.required],
        novioNombre: ['', Validators.required],
        novioApellido: ['', Validators.required],
        novioNacimiento :['', Validators.required],
        noviaCedula: ['', Validators.required],
        noviaNombre: ['', Validators.required],
        noviaApellido: ['', Validators.required],
        noviaNacimiento: ['', Validators.required],
        cursilloLugar: [''],
        cursilloHora: ['', Validators.required],
        fechaCursillo: ['', Validators.required],
    });
  }

  /*-----------------------MÉTODO PARA RECUPERAR VALORES DEL FORMULARIO DE LOS DIFERENTES CAMPOS-----------------------*/
  get novioCedula(){return this.FormCursillo.get('novioCedula');}
  get novioNombre(){return this.FormCursillo.get('novioNombre');}
  get novioApellido(){return this.FormCursillo.get('novioApellido');}
  get novioNacimiento(){return this.FormCursillo.get('novioNacimiento');}
  get noviaCedula(){return this.FormCursillo.get('noviaCedula');}
  get noviaNombre(){return this.FormCursillo.get('noviaNombre');}
  get noviaApellido(){return this.FormCursillo.get('noviaApellido');}
  get noviaNacimiento(){return this.FormCursillo.get('noviaNacimiento');}
  get cursilloLugar(){return this.FormCursillo.get('cursilloLugar');}
  get cursilloHora(){return this.FormCursillo.get('cursilloHora');}
  get fechaCursillo(){return this.FormCursillo.get('fechaCursillo');}

  /*-----------------------METÓDO QUE PERMITE BUSCAR A UNA PERSONA POR NUMERO DE CÉDULA-----------------------*/
  buscarCedula(cedula){
    return this.PersonasLista.find(function(persona){
        return persona.persCedula==cedula; 
    });
  }
  
  /*-----------------------METÓDO QUE PERMITE BUSCAR AL NOVIO POR NUMERO DE CÉDULA-----------------------*/
  findbyCedulaNovio() {
    if (this.PersonasLista.includes(this.buscarCedula(this.FormCursillo.get('novioCedula').value))){
      this.PersonaNovio = this.buscarCedula(this.FormCursillo.get('novioCedula').value);
    }else{
      Swal.fire({
        title:'Usuario no existe',
        text: `Desea registrar al usuario ${this.FormCursillo.get('novioCedula').value} ?`,
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

  /*-----------------------METÓDO QUE PERMITE BUSCAR A LA NOVIA POR NUMERO DE CÉDULA-----------------------*/
  findbyCedulaNovia() {
    if (this.PersonasLista.includes(this.buscarCedula(this.FormCursillo.get('noviaCedula').value))){
      this.PersonaNovia = this.buscarCedula(this.FormCursillo.get('noviaCedula').value);
    }else{
      Swal.fire({
        title:'Usuario no existe',
        text: `Desea registrar al usuario ${this.FormCursillo.get('noviaCedula').value} ?`,
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
    this.cursilloMatrimonio = new CursilloMatrimonio();
    this.cursilloMatrimonio.cursmFecha = this.datecursillo;
    if(this.date8.getMinutes()==0){
      this.cursilloMatrimonio.cursmHora = this.date8.getHours()+":0"+this.date8.getMinutes();
    }else{
      this.cursilloMatrimonio.cursmHora = this.date8.getHours()+":"+this.date8.getMinutes();
    }
    this.cursilloMatrimonio.cursmNnovia = this.PersonaNovia.persNombre + " " + this.PersonaNovia.persApellido;
    this.cursilloMatrimonio.cursmNnovio = this.PersonaNovio.persNombre + " " + this.PersonaNovio.persApellido;
    this.cursilloMatrimonio.cursmLugar = "Parroquia San Joaquín";
    this.cursilloMatrimonio.cursmEstado=false;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CURSILLO PRE-MATRIMONIAL. EL METÓDO PARA ALMACENAR UN NUEVO CURSILLO-----------------------*/ 
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
      console.log(this.cursilloMatrimonio);
      this.CursilloMatrimonioService.createCursillo(this.cursilloMatrimonio).subscribe(data => {
        Swal.fire(
          'Cursillo Registrado',
          'El registro se realizo correctamente',
          'success'
        );
        console.log("Cursillo creado Correctamente");
        this.FormCursillo.reset();
      });
    }
  }

}
