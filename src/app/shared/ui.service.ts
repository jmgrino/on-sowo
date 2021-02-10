import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UIService {
  loadingStateChanged = new Subject < boolean > ();

  constructor(private snackbar: MatSnackBar) {}

  showStdSnackbar(message) {
    this.showSnackbar(message, 'OK', 10000)
  }

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration,
      panelClass: ['snackbar-style']
    });
  }

  translateFirestoreError(error: any) {
    switch (error.code) {
      case 'cancelled':
        return 'Operación cancelada';
      case 'unknown':
        return 'Error desconocido';
      case 'invalid-argument':
        return 'Argumento no valido';
      case 'notFound':
        return 'No se encotró el documento';
      case 'already-exists':
        return 'El documento que se pretende crear, ya existe';
      case 'permission-denied':
        return 'No tienes permisos para realizar esta operación';
      case 'aborted':
        return 'Operación abortada';
      case 'out-of-range':
        return 'Rango invalido';
      case 'unimplemented':
        return 'Esta operación no ha sido implementada o no es soportada aún';
      case 'internal':
        return 'Error interno';
      case 'unavailable':
        return 'Por el momento el servicio no está disponible, intenta más tarde';
      case 'unauthenticated':
        return 'Usuario no autenticado';
      default:
        return error.message;
    }
  }

  translateAuthError(error: any) {
    switch (error.code.slice(5)) {
      case 'email-already-in-use':
        return 'Este correo ya está siendo usado por otro usuario';
      case 'user-disabled':
          return 'Este usuario ha sido deshabilitado';
      case 'operation-not-allowed':
          return 'Operación no permitida';
      case 'invalid-email':
          return 'Correo electrónico no valido';
      case 'wrong-password':
          return 'Contraseña incorrecta';
      case 'user-not-found':
          return 'No se encontró cuenta del usuario con el correo especificado';
      case 'network-error':
          return 'Problema al intentar conectar al servidor';
      case 'weak-password':
          return 'Contraseña muy debil o no válida';
      case 'missing-email':
          return 'Hace falta registrar un correo electrónico';
      case 'internal-error':
          return 'Error interno';
      case 'invalid-custom-token':
          return 'Token personalizado invalido';
      case 'too-many-requests':
          return 'Ya se han enviado muchas solicitudes al servidor';
      default:
          return error.message;
    }
  }

  translateStorageError(error: any) {
    switch (error.code.slice(8)) {
      case 'unknown':
        return 'Error desconocido';
      case 'quota-exceeded':
          return 'El espacio para guardar archivos ha sido sobrepasado';
      case 'unauthenticated':
          return 'Usuario no autenticado';
      case 'unauthorized':
          return 'Usuario no autorizado para realizar esta operación';
      case 'retry-limit-exceeded':
          return 'Tiempo de espera excedido. Favor de intentar de nuevo';
      case 'download-size-exceeded':
          return 'El tamaño de descarga excede el espacio en memoria';
      case 'cancelled':
          return 'Operación cancelada';
      default:
          return error.message;
    }
  }


}
