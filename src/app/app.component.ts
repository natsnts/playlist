import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class AppComponent implements OnInit {
  playlist: any[] = [];
  novaMusica = { id: null, musica: '', artista: '' };
  editando: boolean = false;
  apiUrl = 'http://localhost:5000/playlist';
  formStatus: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarPlaylist();
  }

  carregarPlaylist() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.playlist = data;
      },
      error: (err) => {
        console.error('Erro ao carregar playlist:', err);
        this.formStatus = 'Erro ao carregar a playlist: ' + (err.error?.error || 'Erro desconhecido');
        this.limparStatus();
      }
    });
  }

  salvarMusica() {
    if (!this.novaMusica.musica || !this.novaMusica.artista) {
      this.formStatus = 'Por favor, preencha os campos Música e Artista.';
      this.limparStatus();
      return;
    }

    if (this.editando) {
      this.http.put('${this.apiUrl}/${this.novaMusica.id}', this.novaMusica).subscribe({
        next: (response: any) => {
          this.formStatus = response.success || 'Música editada com sucesso';
          this.carregarPlaylist();
          this.resetForm();
          this.limparStatus();
        },
        error: (err) => {
          console.error('Erro ao editar música:', err);
          this.formStatus = 'Erro ao editar música: ' + (err.error?.error || 'Erro desconhecido');
          this.limparStatus();
        }
      });
    } else {
      this.http.post(this.apiUrl, this.novaMusica).subscribe({
        next: (response: any) => {
          this.formStatus = response.success || 'Música adicionada com sucesso';
          this.carregarPlaylist();
          this.resetForm();
          this.limparStatus();
        },
        error: (err) => {
          console.error('Erro ao adicionar música:', err);
          this.formStatus = 'Erro ao adicionar música: ' + (err.error?.error || 'Erro desconhecido');
          this.limparStatus();
        }
      });
    }
  }

  editarMusica(musica: any) {
    this.novaMusica = { ...musica };
    this.editando = true;
  }

  removerMusica(id: number) {
    this.http.delete('${this.apiUrl}/${id}').subscribe({
      next: (response: any) => {
        this.formStatus = response.success || 'Música removida com sucesso';
        this.carregarPlaylist();
        this.limparStatus();
      },
      error: (err) => {
        console.error('Erro ao remover música:', err);
        this.formStatus = 'Erro ao remover música: ' + (err.error?.error || 'Erro desconhecido');
        this.limparStatus();
      }
    });
  }

  resetForm() {
    this.novaMusica = { id: null, musica: '', artista: '' };
    this.editando = false;
  }

  limparStatus() {
    setTimeout(() => {
      this.formStatus = '';
    }, 3000);
  }
}