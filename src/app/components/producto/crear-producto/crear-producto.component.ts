import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto';

import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { ProductoService } from 'src/app/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
})
export class CrearProductoComponent implements OnInit {
  form: FormGroup;
  priceIsValid: boolean = true;
  titulo: string = 'Crear Producto';
  id: string | null;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private aRouter: ActivatedRoute
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      category: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      price: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.isUpdate();
  }

  /**
   * Method which checks if an input is valid
   * @param controlName name which represent the input form
   * @param errorName error code to check
   * @returns boolean value which indicates if it's valid
   */
  hasError(controlName: string, errorName: string): any {
    return this.form.controls[controlName].hasError(errorName);
  }

  /**
   * Method which manage save button
   */
  save(): any {
    const product: Producto = this.form.value;
    if (product.price === 0) {
      const message = this.id !== null ? 'actualizar' : 'registrar';
      Confirm.show(
        'Mensaje de Confirmación',
        `Está a punto de ${message} un producto con un precio de S/.0 ¿Está seguro?`,
        'Sí',
        'No',
        () => {
          this.handleSave(product);
        },
        () => {
          return;
        }
      );
    } else {
      this.handleSave(product);
    }
  }

  /**
   * Method which show a message based on the server response type
   * @param type indicates the server response type
   * @param product indicates de product object to be saved
   */
  sendMessage(type: string, product: Producto): any {
    const successMessage = this.id !== null ? 'Actualización' : 'Registro';
    const failureMessage =
      this.id !== null ? 'la Actualización' : 'el Registro';
    const bMessage = this.id !== null ? 'actualizado' : 'registrado';
    switch (type) {
      case 'success':
        Report.success(
          `${successMessage} Exitoso 😄`,
          `El producto ${product.name} fue ${bMessage} exitosamente.`,
          'Listo'
        );
        break;
      case 'failure':
        Report.failure(
          `Fallo en ${failureMessage} 😐`,
          `El producto ${product.name} no pudo ser ${bMessage}.`,
          'Listo'
        );
        break;
      default:
        Report.failure(
          `Fallo en ${failureMessage} 😐`,
          `Ocurrió un error.`,
          'Listo'
        );
        break;
    }
  }

  /**
   * Method which uses the ProductService to send an http post or put request
   * @param product indicates the product to be saved or updated
   */
  handleSave(product: Producto): any {
    if (this.id !== null) {
      //Update
      this.productoService.updateProduct(this.id, product).subscribe(
        (data) => {
          this.sendMessage('success', product);
          this.router.navigate(['/']);
        },
        (error) => {
          this.sendMessage('failure', product);
          this.form.reset();
        }
      );
    } else {
      //Create
      this.productoService.createProduct(product).subscribe(
        (data) => {
          this.sendMessage('success', product);
          this.router.navigate(['/']);
        },
        (error) => {
          this.sendMessage('failure', product);
          this.form.reset();
        }
      );
    }
  }

  /**
   * Method which verify if is an edit o create process and if it's an edit process
   * fill the form based on the attributes of the selected product
   */
  isUpdate(): any {
    if (this.id !== null) {
      this.titulo = 'Editar Producto';
      this.productoService.getProduct(this.id).subscribe((data) => {
        this.form.setValue({
          name: data.data.name,
          category: data.data.category,
          price: data.data.price,
        });
      });
    }
  }
}
