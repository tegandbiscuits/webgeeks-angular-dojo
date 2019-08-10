import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, takeWhile } from 'rxjs/operators';
import { NoteService } from '../note.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  editing: boolean;
  noteForm = new FormGroup({
    name: new FormControl(''),
    body: new FormControl(''),
  });

  constructor(
    private route: ActivatedRoute,
    private noteService: NoteService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe((routeData) => {
      this.editing = routeData.edit;
    });

    this.getAndSetNote();
  }

  saveNote() {
    this.route.paramMap.subscribe((params) => {
      const noteId = params.get('noteId');
      const gameId = params.get('gameId');
      const note = this.noteForm.value;

      this.noteService.saveNote(gameId, {
        ...note,
        id: noteId,
      }).subscribe(() => {
        this.snackBar.open('Saved Note');
      }, (err) => {
        console.error('Save note error:', err);
        this.snackBar.open('Failed to Save Note');
      });
    });
  }

  getAndSetNote() {
    this.route.paramMap.pipe(
      takeWhile((params: ParamMap) =>
        !!params.get('gameId') && !!params.get('noteId')
      ),
      switchMap((params: ParamMap) =>
        this.noteService.getNote(params.get('gameId'), params.get('noteId'))
      )
    ).subscribe(({ name, body }) => {
      this.noteForm.setValue({
        name,
        body
      });
    });
  }
}
