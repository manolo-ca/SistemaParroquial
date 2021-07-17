import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Recibo } from './administrar-recibos';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  private url_mater: string =environment.URL_BACKEND;

  private urlreciboEndPoint:string="http://"+this.url_mater+"/sj/recibos/";

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) { }

  guardarRecibo(recibo:Recibo):Observable<Recibo>{
    return this.http.post<Recibo>(`${(this.urlreciboEndPoint)}/guardar/`,recibo);
  }
  listarRecibos():Observable<Recibo[]>{
    return this.http.get(`${(this.urlreciboEndPoint)}/listar`).pipe( map(response=>response as Recibo[]));
  }

  buscarRecibo(id):Observable<Recibo>{
    return this.http.get<Recibo>(`${(this.urlreciboEndPoint)}/buscar/${(id)}`);
  }

  eliminarRecibo(id):Observable<Recibo>{
    return this.http.delete<Recibo>(`${(this.urlreciboEndPoint)}/borrar/${(id)}`,{headers:this.httpHeaders});
  }
}
