import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import{tipoInscripcion} from './tipoInscripcion';
import{tipoInscripcionService} from './tipoInscripcion.service';
import Swal from 'sweetalert2';
import { MatriculaService } from '../matriculaalumno-registrado/matricula.service';
import { matriculaAlumno } from '../matriculaalumno-registrado/matriculaAlumno';

@Component({
  selector: 'app-administrar-tipo-inscripcion',
  templateUrl: './administrar-tipo-inscripcion.component.html',
})
export class AdministrarTipoInscripcionComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE DE TIPO DE INSCRIPCIÓN-----------------------*/
  ttipoinscripcion:tipoInscripcion[];
  private ttipoinscripcion2:tipoInscripcion=new tipoInscripcion();
  addForm1: FormGroup;
  dis: boolean;
  disActualizar:boolean;
  disEliminar:boolean;
  submitted1 = false;
  inscripciones: any[];
  tipo = {};
  ListaMatriculas: matriculaAlumno[];

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(
    private nodeService: NodeService,
    private router: Router, 
    private formBuilder: FormBuilder,
    private tipoinscripcionservice: tipoInscripcionService,
    private MatriculasServicio : MatriculaService

  ){
  }

  ngOnInit() {

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.addForm1 = this.formBuilder.group({
      tipe_nombre: ['', Validators.required]
    });

    /*-----------------------LLAMAMOS AL SERVICIO DE MATRÍCULAS. EL METÓDO PARA LISTAR TODAS LAS MATRÍCULAS Y ALMACENAMOS-----------------------*/
    this.MatriculasServicio.getMatriculas().subscribe(
      servicio => this.ListaMatriculas = servicio
    );

    this.listarTiposInscripcion();
  }

  /*-----------------------MÉTODO PARA RECUPERAR VALORES DEL FORMULARIOS DEL CAMPO TIPO DE INSCRIPCIÓN EL NOMBRE-----------------------*/
  get tipe_nombre(){return this.addForm1.get('tipe_nombre');}

  /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA LISTAR TODOS LOS TIPOS DE INSCRIPCIÓN Y ALMACENAMOS-----------------------*/
  listarTiposInscripcion(){
    this.tipoinscripcionservice.getTipoInscripciones().subscribe(
      data=>this.ttipoinscripcion=data
    );
  }

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA AGREGAR UN NUEVO TIPO DE INSCRIPCIÓN-----------------------*/
  anadirTipoInscripcion() {
    this.dis = true;
    this.addForm1.reset();
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA ALMACENAR UN NUEVO TIPO DE INSCRIPCIÓN-----------------------*/
  public create(): void {
    if(this.addForm1.invalid){
      this.dis=false;
      Swal.fire(
        'Campos erroneos',
        'Verifique que no existan campos vacios y datos correctos.',
        'error');
    }else{
      this.ttipoinscripcion2.tipiNombre = this.addForm1.get("tipe_nombre").value;
      this.ttipoinscripcion2.tipiId=null;
      this.tipoinscripcionservice.create(this.ttipoinscripcion2).subscribe(
        Response => {
          Swal.fire(
            'Nuevo Tipo de Inscripción',
            'Tipo de Inscripción se registro correctamente.',
            'success');
          this.dis=false;
          this.reload('administrarTipoInscripcion');
        }
      )
    }
  }

  /*-----------------------METÓDO PARA RECARGAR LA VENTANA DE TIPO DE INSCRIPCIÓN-----------------------*/
  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('Inicio', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA ELIMINAR UN TIPO DE INSCRIPCIÓN MEDIANTE EL ID-----------------------*/
  delete(servicio:tipoInscripcion): void {
    var bandera1 : Boolean =false;
    for (let index = 0; index < this.ListaMatriculas.length; index++) {
      if(servicio.tipiNombre == this.ListaMatriculas[index].matrFkTipoinscrpcion.tipiNombre){
        bandera1 = true;
      }
    }
    Swal.fire({
      title:'Eliminar Tipo de Inscripción',
      text: `¿Desea Eliminar el tipos de inscripción ${servicio.tipiNombre} ?`,
      showDenyButton:true,
      confirmButtonText: 'Aceptar',
      denyButtonText: 'Cancelar',
    }).then((result)=>{
      if(result.isConfirmed){
        if(bandera1 == false){
          this.tipoinscripcionservice.delete(servicio.tipiId).subscribe(
            response => {
              this.ttipoinscripcion = this.ttipoinscripcion.filter(servi => servi !== servicio)
              Swal.fire('Tipo de Inscripción Eliminado!','Los cambios no se pueden revertir','success')
              this.reload('administrarTipoInscripcion');
            }
          )
        }else{
          Swal.fire(
            'Tipo de Inscripció en uso',
            'No se puede eliminar este Tipo de Inscripción.',
            'question');
        } 
      }
    });
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA BUSCAR UN TIPO DE INSCRIPCIÓN MEDIANTE EL ID-----------------------*/
  cargarServicio(ttipoinscripcion: tipoInscripcion): void {
    localStorage.setItem("tipiId", ttipoinscripcion.tipiId.toString());
    let tipiId = localStorage.getItem('tipiId');
    this.tipoinscripcionservice.getTipoInscripcionesId(+tipiId).subscribe((data) =>
    this.ttipoinscripcion2 = data)
    this.dis = true;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE TIPO DE INSCRIPCIÓN. EL METÓDO PARA ACTUALIZAR UN TIPO DE INSCRIPCIÓN-----------------------*/
  public update(): void {
    this.tipoinscripcionservice.update(this.ttipoinscripcion2).subscribe(cliente => {
      this.listarTiposInscripcion();
      this.dis = false;
    })
  }
}


