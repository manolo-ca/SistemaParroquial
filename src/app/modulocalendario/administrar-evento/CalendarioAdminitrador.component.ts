import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { NodeService } from 'src/app/demo/service/nodeservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Calendario} from './CalendarioAdministrador';
import { AdministrarCalendarioComponentservice} from './CalendarioAdminitrador.service';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicioslista',
  templateUrl: './calendarioAdminitrador.component.html'
 
})
export class ClendarioAdminComponent implements OnInit {

  /*-----------------------VARIABLES DEL COMPONENTE CALENDARIO ADMINISTRADOR-----------------------*/
  servicio: Calendario[];
  private servicio2: Calendario = new Calendario();
  files: TreeNode[];
  addForm2: FormGroup;
  dis: boolean;
  submitted1 = false;
  cols: any[];
  inscripciones: any[];
  tipo = {};

  verificarEventoExistente :boolean =false;

  dateActual : Date = new Date();
  dateRecuperda : Date;
  horaRecuperada:Date;
  horaEvento :Date;

  dateEvento : Date = new Date();
  dateEventoSeleccion : Date;

  /*-----------------------CONSTRUCTOR CON TODOS LOS SERVICIOS DECLARADOS-----------------------*/
  constructor(
    private activatedRoute: ActivatedRoute,
    private servicioService: AdministrarCalendarioComponentservice ,
    private nodeService: NodeService,
    private router: Router,
    private formBuilder: FormBuilder
  ){ 

  }

  ngOnInit() {

    /*-----------------------DECLARAMOS NUESTROS CAMPOS DENTRO DEL FORMULARIO-----------------------*/
    this.addForm2 = this.formBuilder.group({
      tipe_id: [''],
      tipe_serviciop: ['', Validators.required],
      tipe_evento: ['', Validators.required],
      tipe_hora: ['', Validators.required],
      tipe_lugar: ['', Validators.required],
      tipe_responsable: ['', Validators.required],
      tipe_descripcion: ['']
    });
 
    /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA LISTAR TODOS LOS EVENTOS Y ALMACENAMOS-----------------------*/
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );


  }

  /*-----------------------METÓDO QUE HABILITA LA VENTANA PARA AGREGAR UN NUEVO EVENTO-----------------------*/
  showDialog() {
    this.addForm2.get("tipe_evento").reset();
    this.addForm2.get("tipe_hora").reset();
    this.addForm2.get("tipe_lugar").reset();
    this.addForm2.get("tipe_responsable").reset();
    this.addForm2.get("tipe_descripcion").reset();
    this.dateEvento = new Date();
    this.dis = true;
    this.submitted1 =false;
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA ALMACENAR UN NUEVO EVENTO-----------------------*/
  public create(): void {

    let mesFechaEvento :number =0;
    let diaRestante :number =0;
    let FechaEvento :string ="";
    mesFechaEvento = this.dateEvento.getUTCMonth() + 1;

    if (this.dateEvento.getUTCDate()<10) {
      FechaEvento = this.dateEvento.getFullYear()+"-"+mesFechaEvento+"-0"+this.dateEvento.getUTCDate();
    }

    if (mesFechaEvento<10 ) {
      FechaEvento = this.dateEvento.getFullYear()+"-0"+mesFechaEvento+"-"+this.dateEvento.getUTCDate();
    }

    if (mesFechaEvento<10 && this.dateEvento.getUTCDate()<10) {
      FechaEvento = this.dateEvento.getFullYear()+"-0"+mesFechaEvento+"-0"+this.dateEvento.getUTCDate();
    }

    for (let index = 0; index < this.servicio.length; index++) {
      if (FechaEvento == this.servicio[index].caleFecha.toString()) {
        if (this.addForm2.get("tipe_hora").value == this.servicio[index].caleHora.toString()) {
          this.verificarEventoExistente=true;
          console.log("Evento ya existe en esa fecha")
        }
      }
    }

    if ( this.dateActual.getTime()>this.dateEvento.getTime()) {
      swal.fire('Fecha no valida',`Fecha de evento no es actual o futura`,'error');
      this.dis = false;
      return;
    }else{
      if (this.addForm2.invalid) {
        swal.fire('Registro incompleto',`Existen campos vacios necesarios para el registro. Porfavor llenar todos los campos solicitados`,'error');
        this.dis = false;
        return;
      }else{
        if (this.verificarEventoExistente==true) {
          swal.fire('Registro Erroneo',`Ya existe un evento en esa fecha y hora`,'error');
          this.dis = false;
          return;
        }else{
          this.servicio2.caleFecha = new Date (this.dateEvento.getUTCFullYear()+"/"+mesFechaEvento+"/"+this.dateEvento.getUTCDate())
          this.servicio2.caleId=null;
          this.servicioService.create(this.servicio2).subscribe(
            Response => {
              this.dis = false;
              swal.fire('Nuevo Evento',`Evento creado con exito!`,'success')
              this.servicioService.getServicios().subscribe(
                servicio => this.servicio = servicio
              );
            }
          )
        }
      }
    }
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA LISTAR TODOS LOS EVENTOS Y ACTUALIZADOS-----------------------*/
  public refrescar(): void {
    this.servicioService.getServicios().subscribe(
      servicio => this.servicio = servicio
    );
    this.dis=false;
  }
  
  /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA BUSCAR UN EVENTO MEDIANTE EL ID-----------------------*/
  cargarServicio(servicio:Calendario): void {
    try{
      localStorage.setItem("servId", servicio.caleId.toString());
      let servId = localStorage.getItem('servId');
      this.servicioService.getServicio(+servId).subscribe((data) =>{

        this.servicio2 = data;
        this.dateEvento = new Date(data.caleFecha.toString());
        this.dis = true;
        this.submitted1=true;
      })
    }catch(e){

    }
    
  }


  /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA ACTUALIZAR UN EVENTO MEDIANTE EL ID-----------------------*/
  public update(): void {
    try{
      let mesFechaEvento :number =0;
      mesFechaEvento = this.dateEvento.getUTCMonth() + 1;
      this.servicio2.caleFecha = new Date (this.dateEvento.getUTCFullYear()+"/"+mesFechaEvento+"/"+this.dateEvento.getUTCDate())
      this.servicioService.update(this.servicio2)
        .subscribe(cliente => {
          this.dis = false;
          this.submitted1=false;
          swal.fire('Evento',`Evento actualizado con exito!`,'success')
          this.servicioService.getServicios().subscribe(
            servicio => this.servicio = servicio
          );
        }
      )
    }catch(e){

    }
    
  }

  /*-----------------------LLAMAMOS AL SERVICIO DE CALENDARIO. EL METÓDO PARA ELIMINAR UN EVENTO MEDIANTE EL ID-----------------------*/
  delete(servicio:Calendario): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swal.fire({
      title: 'Esta seguro?',
      text: `Seguro que desea eliminar el evento `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.servicioService.delete(servicio.caleId).subscribe(
        response => {
          this.servicio = this.servicio.filter(servi => servi !== servicio)
          swal.fire(
            'Evento eliminado!',
            `Evento  eliminado con exito.`,
            'success'
          )
        })
      }
    })
  }
}
