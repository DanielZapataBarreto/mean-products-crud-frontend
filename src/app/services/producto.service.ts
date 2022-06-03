import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  url = 'http://localhost:4001/api/v1/product/';

  constructor(private http: HttpClient) {}

  /**
   * Method which fetchs the data from the server
   * @returns a JSON object with an attribute named 'data' with a list of produts
   */
  getAllProducts(): Observable<any> {
    return this.http.get(this.url);
  }

  /**
   * Method which fetchs the data from the server
   * @returns a JSON object with an attribute named 'data' with a detailed product
   */
  getProduct(id: string): Observable<any> {
    return this.http.get(this.url + id);
  }

  /**
   * Method which fetchs the detailed data from the server
   * @returns a JSON object with an attribute named 'data' with a new product
   */
  createProduct(product: Producto): Observable<any> {
    return this.http.post(this.url, product);
  }

  /**
   * Method which sends an updated product with its id as param
   * @returns a JSON object with an attribute named 'data' with an updated product
   */
  updateProduct(id: string, product: Producto): Observable<any> {
    return this.http.put(this.url + id, product);
  }

  /**
   * Method which send a products id to be deleted
   * @returns a successfull or failed message
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(this.url + id);
  }
}
