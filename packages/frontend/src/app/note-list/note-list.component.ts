import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Note, NoteService } from '../note.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
})
export class NoteListComponent implements OnInit {
  notes$: Observable<Note[]>;

  constructor(
    public noteService: NoteService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.notes$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.noteService.fetchNotes(params.get('gameId'))),
    );
  }
}
