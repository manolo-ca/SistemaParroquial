import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Caja } from './caja';
import { Observable } from 'rxjs';
import { CajaMovimiento } from './caja-movimiento';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { tipoInscripcion } from 'src/app/modulomatriculas/administrar-tipo-inscripcion/tipoInscripcion';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  private url_mater: string =environment.URL_BACKEND;

  private urlEndPointCaja:string='http://'+this.url_mater+'/sj/caja';
  private urlEndPointCajaMov:string="http://"+this.url_mater+"/reports";
  private urlMovimientosByCajaId:string = "http://"+this.url_mater+"/reports/movimientos";
  private urlCajaById: string = "http://"+this.url_mater+"/sj/caja/buscar";
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private urlInternetDate: string = "http://worldtimeapi.org/api/timezone/America/Guayaquil";
  private urlcajaMovimientoEdit: String = "http://"+this.url_mater+"/reports";

  constructor(private http:HttpClient) { }

  getMovimientos(tipo: string): Observable< CajaMovimiento[]> {
    return this.http.get(this.urlEndPointCajaMov+'/'+tipo).pipe(
      map(response => response as CajaMovimiento[])
    )
  }

  getMovimientosByCajaId(id: number): Observable< CajaMovimiento[]> {
    return this.http.get(this.urlMovimientosByCajaId+'/'+id).pipe(
      map(response => response as CajaMovimiento[])
    );
  }

  getCaja(): Observable<Caja[]> {
    return this.http.get(this.urlEndPointCaja).pipe(
      map(response => response as Caja[])
    );
  }

  getCajaPorID(id: number): Observable<Caja> {
    return this.http.get(this.urlCajaById+'/'+id).pipe(
      map(response => response as Caja)
    );
  }

  cargarCaja(estado:string):Observable<Caja[]>{
    return this.http.get<Caja[]>(`${(this.urlEndPointCaja)}/cajaestado/${(estado)}`);
  }

  crearMovimientoCaja(cajamovimiento:CajaMovimiento):Observable<CajaMovimiento>{
    return this.http.post<CajaMovimiento>(`${(this.urlEndPointCajaMov)}`,cajamovimiento);
  }

  update(caja: Caja, id:number): Observable<Caja> {
    return this.http.put<Caja>(`${this.urlEndPointCaja}/`+id, caja, { headers: this.httpHeaders })
  }

  updatecajaMovimiento(cajamovimiento:CajaMovimiento): Observable<CajaMovimiento> {
    return this.http.put<CajaMovimiento>(`${this.urlEndPointCajaMov}/${cajamovimiento.cajmId}`, cajamovimiento, { headers: this.httpHeaders })
  }

  getInternetDate():Observable<any>{
    return this.http.get<any>(`${this.urlInternetDate}`);
  }
}
