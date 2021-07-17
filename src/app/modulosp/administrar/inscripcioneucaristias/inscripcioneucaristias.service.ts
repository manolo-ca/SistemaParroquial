import { Injectable } from '@angular/core';
import { InscripcionEucaristias} from './inscripcioneucaristias';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GenericService } from 'src/app/spring-generic-mvc/service/generic.service';
import { environment } from 'src/environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class InscripcioneucaristiaService extends GenericService<InscripcionEucaristias>{

  private url_mater: string =environment.URL_BACKEND;

  
  private urlRead: string = 'http://'+this.url_mater+'/sj/ieucaristia/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/ieucaristia/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/ieucaristia/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/ieucaristia/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/ieucaristia/buscar/';
  private urlSearchPersona: string = 'http://'+this.url_mater+'/sj/ieucaristia/searchid?filtro=';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) {
    super(
      http,
      environment.URL_BACKEND,
      'sj/ieucaristia'
    )
   }

  getInscripcionesEucaristias(): Observable<InscripcionEucaristias[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as InscripcionEucaristias[])
    );
  }
  
  createIEucaristia(inscripcion: InscripcionEucaristias): Observable<InscripcionEucaristias> {
    return this.http.post<InscripcionEucaristias>(this.urlCreate, inscripcion, { headers: this.httpHeaders })
  }

  getInscripcionEucaristia(docuId): Observable<InscripcionEucaristias> {
    return this.http.get<InscripcionEucaristias>(`${this.urlSearch}/${docuId}`)
  }
  
  update(inscripcion: InscripcionEucaristias): Observable<InscripcionEucaristias> {
    return this.http.put<InscripcionEucaristias>(`${this.urlUpdate}/${inscripcion.inseId}`, inscripcion, { headers: this.httpHeaders })
  }

  delete(docuId: number): Observable<InscripcionEucaristias> {
    return this.http.delete<InscripcionEucaristias>(`${this.urlDelete}/${docuId}`, { headers: this.httpHeaders })
  }
}
