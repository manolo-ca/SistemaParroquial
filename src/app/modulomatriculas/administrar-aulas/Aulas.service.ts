import { Injectable } from '@angular/core';
import { Aula } from './Aulaservicio';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class administaraulaservice {

  private urlRead: string = 'http://localhost:6929/sj/Aula/listar/';
  private urlCreate: string = 'http://localhost:6929/sj/Aula/guardar/';
  private urlDelete: string = 'http://localhost:6929/sj/Aula/borrar/';
  private urlUpdate: string = 'http://localhost:6929/sj/Aula/editar/';
  private urlSearch: string = 'http://localhost:6929/sj/Aula/buscar/';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(
    private http: HttpClient
  ) { }

  getServicios(): Observable<Aula[]> {
    return this.http.get(this.urlRead).pipe(
      map(response => response as Aula[])
    );
  }

  create(cliente: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.urlCreate, cliente,
      { headers: this.httpHeaders })
  }

  getServicio(codigo): Observable<Aula> {
    return this.http.get<Aula>(`${this.urlSearch}/${codigo}`)
  }

  update(Aula: Aula): Observable<Aula> {
    return this.http.put<Aula>(`${this.urlUpdate}/${Aula.aulaId}`,
    Aula, { headers: this.httpHeaders })
  }

  delete(codigo: number): Observable<Aula> {
    return this.http.delete<Aula>(`${this.urlDelete}/${codigo}`,
      { headers: this.httpHeaders })
  }
}
