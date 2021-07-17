import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Persona } from '../../modulosp/registropersona/persona';
import { PersonaService } from '../../modulosp/registropersona/persona.service';
import swal from 'sweetalert2';
import { GenerarFacturaComponent } from '../../moduloventas/generar-factura/generar-factura.component';
import { FacturaService } from 'src/app/moduloventas/administrar-factura/factura.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit {

  cliente:Cliente[];

  addForm2: FormGroup;
  
  dis: boolean=false;

  private persona2: Persona = new Persona();

  dis2cliente: boolean=false;

  repCedula: boolean=false;

  private cliente2: Cliente= new Cliente();




  constructor(private clienteService:ClienteService,private personaService:PersonaService,private formBuilder:FormBuilder,private generarFacturaComponent:GenerarFacturaComponent,private facturaServicio:FacturaService) { }

  ngOnInit() {
    this.addForm2 = this.formBuilder.group({
      inse_id: ['', Validators.required],
      inse_cedula: ['', Validators.required],
      inse_nombre: ['', Validators.required],
      inse_apellido: ['', Validators.required],
      inse_email: ['', Validators.required],
      inse_telefono: ['', Validators.required],
      inse_direccion: ['', Validators.required],
      inse_fechanaci: ['', Validators.required],
      inse_fechabautizo: ['', Validators.required]
    });
    this.listarClientes();
  }

/* ---------- LISTAR CLIENTES ---------- */
 public listarClientes(){
    this.clienteService.getClientes().subscribe(cliente=>this.cliente=cliente);
  }

  /* ------- CARGAR DATOS DEL CLIENTE EN EL FORMULARIO DE EDICION ----------- */
  public cargarCliente(cli:Cliente):void{
    this.personaService.getPersona(cli.clieFkPersona.persid).subscribe((data)=>this.persona2=data);
    this.dis = true;
  }

  /* ------- PERMITE CANCELAR LA ACTUALIZACION DE DATOS DEL CLIENTE --------- */
  public validaBoton(){
    this.addForm2.reset();
    this.dis=false;
  }

  /* -------- ACTUALIZA LOS DATOS DEL CLIENTE ----------------- */
  public updateCliente(): void {
    this.dis = false;
    this.personaService.update(this.persona2).subscribe(persona => {
        swal.fire(
          'Cliente Actualizado',
          `Cliente ${this.persona2.persNombre}  ${this.persona2.persApellido} Actualizado con exito!`,
          'success'
        )
        
        this.listarClientes();
        this.addForm2.reset();
        this.generarFacturaComponent.dis=false;
      }
    )
  }

/* -------- ELIMINAR DATOS DEL CLIENTE DE LA BD -------- */

 public  deleteCliente(cli: Cliente): void {
  this.generarFacturaComponent.dis=false;
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro que desea eliminar?',
      text: `¡No podrás revertir esto! Eliminar`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Eliminar! ',
      cancelButtonText: ' No, Cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.deleteCliente(cli.clieId).subscribe(
          response => {
            swalWithBootstrapButtons.fire(
              'Eliminado',
              'Su registro fue eliminado sadisfactoriamente',
              'success'
            )
         this.listarClientes();
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Su registro no se elimino :)',
          'error'
        )
        this.generarFacturaComponent.dis=true;
      }
    })
  }

/* ----------------- GUARDA LOS DATOS DEL CLIENTE EN LA BD ------------------- */
  public createCliente(): void {

    //Validacion de existencia de cliente
    this.facturaServicio.getBuscaPersona(this.persona2.persCedula).subscribe((data1)=>{
      console.log(data1);
      
      if(data1 == null){
        this.personaService.create(this.persona2).subscribe((datapersona)=>{
          this.cliente2.clieFkPersona=datapersona;
            this.clienteService.guardarCliente(this.cliente2).subscribe(
              Response => {
                this.generarFacturaComponent.dis=false;
                swal.fire(
                  'Cliente Guardado',
                  `Cliente ${this.persona2.persNombre} ${this.persona2.persApellido} creado con exito!`,
                  'success'
                ).then((result) => {
                  if (result.isConfirmed) {
                    this.listarClientes();
                    this.addForm2.reset();
                  }
                })
               
              }
            )
        });
      }else{

        if (data1.persCedula != null){
          this.clienteService.getPersona(data1.persid).subscribe((data2)=>{
            console.log(data2);
            if(data2!=null){
              this.repCedula = true;
              this.generarFacturaComponent.dis=false;
              swal.fire(
                'Cliente ya Existente',
                `Cliente ${this.persona2.persNombre} ${this.persona2.persApellido} encontrado!`,
                'error'
              ).then((result) => {
                if (result.isConfirmed) {
                  this.addForm2.reset();
                  this.dis2cliente=true;
                  this.generarFacturaComponent.dis=true;
                }
              })
            }else{
              this.repCedula=false;
            }
  
            //Validacion de existencia de persona
            if(this.dis2cliente==true && this.repCedula==false){
              console.log(3);
              this.cliente2.clieFkPersona=this.persona2;
              this.clienteService.guardarCliente(this.cliente2).subscribe(
                Response => {
                  this.generarFacturaComponent.dis=false;
                  swal.fire(
                    'Cliente Guardado',
                    `Cliente ${this.persona2.persNombre} ${this.persona2.persApellido} creado con exito!`,
                    'success'
                  ).then((result) => {
                    if (result.isConfirmed) {
                      this.listarClientes();
                      this.addForm2.reset();
                    }
                  })
                }
              )
            }
        
          });
        }
      }

    });
 
    }


    /* VALIDA LA PERSONA REPETIDA */

    public validaCedula(event:any){
     
      let cedula:string=event.target.value as string;
      this.facturaServicio.getBuscaPersona(cedula).subscribe((data)=>{
        //console.log(data);
        if(data=="vacio" ||data==null){
          this.generarFacturaComponent.dis=true;
        }else{
          this.generarFacturaComponent.dis=false;
          swal.fire({
            title: '¿Persona ya registrada?',
            text: `Desea cargar los datos de la persona ${data.persNombre} ${data.persApellido}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
          }).then((result) => {
            if (result.isConfirmed) {
              this.persona2=data;
              this.dis2cliente=true;
              this.generarFacturaComponent.dis=true;
            }else{
              event.target.value="";
              this.generarFacturaComponent.dis=true;
            }
          })
        }
     
      });
      }
}


