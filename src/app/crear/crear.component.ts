import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear',
  imports: [CommonModule,FormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css',
  standalone:true
})
export class CrearComponent {

  nuevoAlumno: any = {
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    password: '',
    foto: null,
    sexo: '',
    estado: true,
    grupos: {
      id_grupo: 0
    }
    
  }; 

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.apiService.isAuthenticated()) {
      console.log('Sesión no iniciada. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    } else {
      console.log('Sesión iniciada correctamente.');
    }
  }

  registrarAlumno(): void {
    console.log('Datos a enviar:', this.nuevoAlumno);
    this.apiService.registrarAlumno(this.nuevoAlumno).subscribe({
      next: (response) => {
        console.log('Alumno registrado con éxito:', response);
        alert('Alumno registrado correctamente');
     
      },
      error: (error) => {
        console.error('Error al registrar el alumno:', error);
        alert('Error al registrar el alumno');
      }
    });
  }

  procesarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        const trimmedBase64 = base64.substring(base64.indexOf(',') + 1); // Quitamos el prefijo
        this.nuevoAlumno.foto = trimmedBase64; // Asignamos al modelo
        console.log('Base64 recortado:', trimmedBase64);
      };

      reader.readAsDataURL(file); // Leemos el archivo como Data URL
    } else {
      console.log('No se seleccionó ningún archivo');
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    this.apiService.setUsuarioActual(null);
    console.log('Sesión cerrada');
    this.router.navigate(['/login']);
  }
}
