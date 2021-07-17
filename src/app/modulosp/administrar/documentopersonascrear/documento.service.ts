import { Injectable } from '@angular/core';
import { Documento } from './documento';
import { Observable,throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private url_mater: string =environment.URL_BACKEND;

    
  private urlRead: string = 'http://'+this.url_mater+'/sj/documento/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/documento/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/documento/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/documento/editar/';
  private searchDocumento:string='http://'+this.url_mater+'/sj/documento/searchDocumento?filtrouno=';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/documento/buscar/';
  private urlSearchPersona: string = 'http://'+this.url_mater+'/sj/documento/searchid?filtro=';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  // Guarda los documentos en un Observable
  getDocumentos(): Observable<Documento[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Documento[])
    );
  }
  
  //Crea los Documentos en un observable
  create(documento: Documento): Observable<any> {
    return this.http.post<any>(this.urlCreate, documento, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Guardar', 'Error al crear', 'error'
        );
        return throwError(e);
      })
    );
  }
  //Listar Documentos 
  getDocumento(docuId): Observable<Documento> {
    return this.http.get<Documento>(`${this.urlSearch}${docuId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al cargar', 'Error al listar los documentos', 'error'
        );
        return throwError(e);
      })
    );
  }
  //Busca una Lista de documentos 
  getDocumentoPlantilla(iddocumento,idpersona): Observable<Documento> {
    console.log(iddocumento,idpersona);
       return this.http.get<Documento>(`${this.searchDocumento}${iddocumento}&filtrodos=${idpersona}`).pipe(
         catchError(e => {
           
           swal.fire(
             'Error al cargar', 'No se encontro el documento solicitado', 'error'
           );
           return throwError(e);
         })
       );
     }

     //Carga una lista de documentos
  getDocumentoPersona(docuId): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlSearchPersona}${docuId}`).pipe(
      catchError(e => {
        swal.fire(
          'Error al cargar', 'Error al listar los documentos', 'error'
        );
        return throwError(e);
      })
    );
  }
  // Actualiza datos
  update(documento: Documento): Observable<any> {
    return this.http.put<any>(`${this.urlUpdate}/${documento.docuId}`, documento, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal.fire(
          'Error al Actualizar', 'Error al actualizar', 'error'
        );
        return throwError(e);
      })
    );
  }
// Elimina datos
  delete(docuId: number): Observable<any> {
    return this.http.delete<any>(`${this.urlDelete}/${docuId}`, { headers: this.httpHeaders })
    .pipe(
      catchError(e => {
        swal.fire(
          'Error al Eliminar', 'Error al eliminar', 'error'
        );
        return throwError(e);
      })
    );
  }
}