import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Representante } from './representantesEjemplo';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {

  private url_mater: string =environment.URL_BACKEND;

  private urlRead: string = 'http://'+this.url_mater+'/sj/representantes/listar/';
  private urlCreate: string = 'http://'+this.url_mater+'/sj/representantes/guardar/';
  private urlDelete: string = 'http://'+this.url_mater+'/sj/representantes/borrar/';
  private urlUpdate: string = 'http://'+this.url_mater+'/sj/representantes/editar/';
  private urlSearch: string = 'http://'+this.url_mater+'/sj/representantes/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getRepresentantes(): Observable<Representante[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Representante[])
    );
  }

  createRepresentante(representante: Representante): Observable<Representante> {
    return this.http.post<Representante>(this.urlCreate, representante,
      { headers: this.httpHeaders })
  }

  getRepresentante(codigo): Observable<Representante> {
    return this.http.get<Representante>(`${this.urlSearch}/${codigo}`)
  }

  updateRepresentante(representante: Representante): Observable<Representante> {
    return this.http.put<Representante>(`${this.urlUpdate}/${representante.padrId}`,
    representante, { headers: this.httpHeaders })
  }

  deleteRepresentante(id: number): Observable<Representante> {
    return this.http.delete<Representante>(`${this.urlDelete}/${id}`,
      { headers: this.httpHeaders })
  }
}
