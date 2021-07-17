import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cliente } from './cliente';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private url_mater: string =environment.URL_BACKEND;

  private urlClienteEndPoint:string="http://"+this.url_mater+"/sj/clientes/";

  private urlSearchCedula: string = 'http://'+this.url_mater+'/sj/clientes/searchCedula?filtro=';

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http:HttpClient) { }

  getClientes():Observable<Cliente[]>{
    return this.http.get(`${(this.urlClienteEndPoint)}/listar/`).pipe( map(response=>response as Cliente[]));
  }

  guardarCliente(cliente:Cliente):Observable<Cliente>{
    return this.http.post<Cliente>(`${(this.urlClienteEndPoint)}/guardar/`,cliente,{ headers: this.httpHeaders });
  }

  deleteCliente(cliId:number):Observable<Cliente>{
    return this.http.delete<Cliente>(`${(this.urlClienteEndPoint)}/borrar/${(cliId)}`,{headers:this.httpHeaders});
  }

  getPersona(persCedula): Observable<any> {
    return this.http.get<any>(`${this.urlSearchCedula}${persCedula}`,{headers:this.httpHeaders});
  }

}
