import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryOptions, Page } from '../model';
//import { Injectable } from '@angular/core';


export class GenericService<T> {

  constructor(private httpClient: HttpClient, private url: string, private endpoint: string) { 
  //  this.endpoint1 = this.endpoint
  }
  
  public create(item: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}/`, (item))
      .pipe(map(data => data as T));
  }

  public update(item: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}/`, (item))
      .pipe(map(data => data as T));

  }

  read(id: number): Observable<T> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/${id}`)
      .pipe(map((data: any) => data as T));
  }

  list(queryOptions: QueryOptions): Observable<Page<T>> {

    return this.httpClient
      .get(`${this.url}/${this.endpoint}/listar/?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => (data)));
  }
  find(queryOptions: QueryOptions, texto: string): Observable<Page<T>> {
    return this.httpClient
      .get(`${this.url}/${this.endpoint}/listar/${texto}?${queryOptions.toQueryString()}`)
      .pipe(map((data: any) => (data)));
  }
  delete(id: number) {
    return this.httpClient
      .delete(`${this.url}/${this.endpoint}/${id}`);
  }

  private convertData(data: any): T[] {
    return data.map(item => item);
  }
}
