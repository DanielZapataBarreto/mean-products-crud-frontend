import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

import { Report } from 'notiflix/build/notiflix-report-aio';

@Component({
  selector: 'app-listar-producto',
  templateUrl: './listar-producto.component.html',
  styleUrls: ['./listar-producto.component.css'],
})
export class ListarProductoComponent implements OnInit {
  displayedColumns: string[] = [
    'index',
    'id',
    'name',
    'category',
    'price',
    'actions',
  ];

  dataSource: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  /**
   * Method which fetch the data from the server
   */
  getAllProducts(): any {
    this.productoService
      .getAllProducts()
      .subscribe((data) => (this.dataSource = [...data.data]));
  }

  deleteProduct(product: Producto): any {
    this.productoService.deleteProduct(product._id).subscribe(
      (data) => {
        console.log(data);
        this.sendMessage('success', product);
        this.getAllProducts();
      },
      (error) => {
        this.sendMessage('failure', product);
      }
    );
  }

  /**
   * Method which show a message based on the server response type
   * @param type indicates the server response type
   * @param product indicates de product object to be saved
   */
  sendMessage(type: string, product: Producto): any {
    switch (type) {
      case 'success':
        Report.success(
          'Eliminación Exitoso 😄',
          `El producto ${product.name} fue eliminado exitosamente.`,
          'Listo'
        );
        break;
      case 'failure':
        Report.failure(
          'Fallo en la Eliminación 😐',
          `El producto ${product.name} no pudo ser eliminado.`,
          'Listo'
        );
        break;
      default:
        Report.failure('Error 😐', `Ocurrió un error.`, 'Listo');
        break;
    }
  }
}
