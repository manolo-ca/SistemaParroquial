import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import swal from 'sweetalert2';
import { Persona } from 'src/app/modulosp/registropersona/persona';
import { PersonaService } from 'src/app/modulosp/registropersona/persona.service';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import { Usuario } from '../login/login';
import { UsuarioService } from '../login/usuario.service';


@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html'
})
export class GestionUsuarioComponent implements OnInit {

  addForm1: FormGroup;
  addForm2: FormGroup;
  submitted = false;
  dis: boolean;
  dis_edit: boolean;
  tipo = {};

  user: Usuario = new Usuario();
  userEdit: Usuario = new Usuario();
  usuarios: Usuario[];
  persona: Persona = new Persona();
  personas: Persona[];

  seleccionPersona :boolean;

  botonEdit : boolean = false ;

  constructor( 
    private personaService:PersonaService,
    private nodeService: NodeService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private UsuarioServicio:UsuarioService
  ){ 

  }

  ngOnInit() {
    this.addForm1 = this.formBuilder.group({
      userUsuario: ['', Validators.required],
      userPassword: ['', Validators.required],
      userFkPersona: ['', Validators.required],
      userNombre: ['', Validators.required],
      userApellido: ['', Validators.required],
      userCorreo: ['', Validators.required],
      userTelefono: ['', Validators.required],
      userDireccion: ['', Validators.required] 
    });
   this.listarUsuarios();
   this.listarPersonas();
   this.seleccionPersona=false;
  }

  get userUsuario(){return this.addForm1.get('userUsuario');}
  get userPassword(){return this.addForm1.get('userPassword');}

  get f(){
    return this.addForm1.controls;
  }

  showDialog(){
    this.botonEdit=false;
    this.userUsuario.setValue("Usuario0000" + (this.usuarios[this.usuarios.length-1].usuaId+1));
    this.userPassword.setValue("");
    this.dis = true;
    this.seleccionPersona=false;
  }

  seleccionarPersona(){
    this.seleccionPersona=true;
  }

  listarUsuarios():void{
    this.UsuarioServicio.listarUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  listarPersonas():void {
    this.personaService.getPersonas().subscribe((personas) => {
      this.personas = personas;
    }); 
  }

  crearUsuario():void {
    if (this.addForm1.invalid) {
      swal.fire('Registro Erroneo','Existen campos vacios para el registro.','error')
      this.submitted = true;
      this.dis = false;
      return;
    }else{
      if(this.seleccionPersona==true){
        this.user.usuaUsuario = this.userUsuario.value;
        this.user.usuaContraseña = this.userPassword.value;
        this.user.usuaFkPersona = this.persona;
        this.personaService.update(this.persona).subscribe(data => {
          this.UsuarioServicio.crearUsuario(this.user).subscribe(user => {
            swal.fire('Usuario','Usuario creado con exito.','success')
            this.listarUsuarios();
          })
        })
        this.dis = false;
        this.seleccionPersona=false;
      }else{
        swal.fire('Persona Erronea','Seleccionar una persona para el usuario.','error')
        this.dis = false;
      }
    }
  }

  cargarUsuario(user: Usuario): void {
    this.botonEdit=true;
    localStorage.setItem("tipeId", user.usuaId.toString());
    let tipeId = localStorage.getItem('tipeId');
    this.UsuarioServicio.getUsuario(+tipeId).subscribe(data =>{
      this.user=data;
      this.persona= data.usuaFkPersona;
      this.userUsuario.setValue (data.usuaUsuario);
      this.userPassword.setValue(data.usuaContraseña);
      this.dis = true;
      this.seleccionPersona = true;
    });
  }

  editarUsuario():void {
    if (this.addForm1.invalid) {
      swal.fire('Actualización Erronea','Existen campos vacios para la actualización.','error')
      return;
    }else{
      this.user.usuaUsuario = this.userUsuario.value;
      this.user.usuaContraseña = this.userPassword.value;
      this.personaService.update(this.persona).subscribe(data => {
        this.UsuarioServicio.ActualizarUsuario(this.user).subscribe(user => {
          swal.fire('Usuario','Usuario editado con exito.','success')
          this.listarUsuarios();
          this.dis = false;
          this.seleccionPersona=false;
        })
      })
      
    }
  }

  eliminarUser(usuario: Usuario): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! eliminar a ${usuario.usuaFkPersona.persNombre + ' ' + usuario.usuaFkPersona.persApellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.UsuarioServicio.EliminarUsuario(usuario.usuaId).subscribe(
          response => {
            this.usuarios= this.usuarios.filter(servi => servi !== usuario)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `El usuario fue eliminado.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El usuario no se elimino',
          'error'
        )
      }
    })
  }

}
