import React, { useState, useEffect, useContext } from 'react';
import { Label, Note } from "./types";
import { dummyNotesList } from "./constants";
import { ThemeContext, themes } from "./themeContext";

export const StickyNotes = () => {
  const [notes, setNotes] = useState<Note[]>(dummyNotesList);
  const [favorites, setFavorites] = useState<number[]>([]); 
  const initialNote = { id: -1, title: "", content: "", label: Label.other };
  const [newNote, setNewNote] = useState<Note>(initialNote);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [theme, setTheme] = useState(themes.light);
  const themeButton = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === themes.light ? themes.dark : themes.light);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNoteWithId: Note = {
      ...newNote,
      id: notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      title: newNote.title.trim() || "Untitled",
      content: newNote.content.trim() || "No content"
    };
    setNotes(prev => [...prev, newNoteWithId]);
    setNewNote(initialNote);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const selectNoteForEdit = (note: Note) => {
    setSelectedNote(note);
  };

  const handleNoteEdit = (
    e: React.ChangeEvent<HTMLSelectElement> | React.FocusEvent<HTMLDivElement>,
    field: keyof Note
  ) => {
    if (selectedNote) {
      let value: string;
      if (e.target instanceof HTMLSelectElement) {
        value = e.target.value;
      } else {
        value = e.currentTarget.textContent || '';
      }
      setSelectedNote({
        ...selectedNote,
        [field]: value
      });
    }
  };

  const saveEditedNote = () => {
    if (selectedNote) {
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? selectedNote : note
      ));
      setSelectedNote(null);
    }
  };

  useEffect(() => {
    console.log('Favorites updated:', favorites);
  }, [favorites]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className='app-container' style={{ backgroundColor: theme.background, color: theme.foreground }}>
        <form className="note-form" onSubmit={handleSubmit}>
          <div>
            <input 
              name="title"
              value={newNote.title}
              onChange={handleInputChange}
              placeholder="Note Title" 
              required
              data-testid="note-title-input"
            />
          </div>
          <div>
            <textarea 
              name="content"
              value={newNote.content}
              onChange={handleInputChange}
              placeholder="Note Content"
              required
              data-testid="note-content-input"
            ></textarea>
          </div>
          <div>
            <select 
              name="label"
              value={newNote.label}
              onChange={handleInputChange}
              required
              data-testid="note-label-select"
            >
              {Object.values(Label).map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <button type="submit" data-testid="create-note-button">Create Note</button>
          </div>
        </form>
        <div className="notes-grid">
         {notes.map((note) => (
           <div
             key={note.id}
             className="note-item">
             <div className="notes-header">
                <button onClick={() => deleteNote(note.id)} data-testid={`delete-note-button-${note.id}`}>x</button>
                <button onClick={() => toggleFavorite(note.id)}>
                 {favorites.includes(note.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={() => selectNoteForEdit(note)} data-testid={`edit-note-button-${note.id}`}>Edit</button>
             </div>
             {selectedNote && selectedNote.id === note.id ? (
               <>
                 <h2 
                   data-testid={`note-title-edit-${note.id}`}
                   contentEditable 
                   onBlur={(e) => handleNoteEdit(e, 'title')}
                   suppressContentEditableWarning={true}
                 >
                   {note.title}
                 </h2>
                 <p 
                  data-testid={`note-content-edit-${note.id}`}
                   contentEditable 
                   onBlur={(e) => handleNoteEdit(e, 'content')}
                   suppressContentEditableWarning={true}
                 >
                   {note.content}
                 </p>
                 <select 
                   value={selectedNote.label} 
                   onChange={(e) => handleNoteEdit(e, 'label')}
                   data-testid={`note-label-edit-${note.id}`}
                 >
                   {Object.values(Label).map(label => (
                     <option key={label} value={label}>{label}</option>
                   ))}
                 </select>
                 <button onClick={saveEditedNote} data-testid={`save-note-button-${note.id}`}>Save</button>
               </>
             ) : (
               <>
                 <h2 data-testid={`note-title-display-${note.id}`}>{note.title}</h2>
                 <p data-testid={`note-content-display-${note.id}`}>{note.content}</p>
                 <p data-testid={`note-label-display-${note.id}`}>{note.label}</p>
               </>
             )}
           </div>
         ))}
        </div>
        <div className="favorites-list">
          <h3>List of favorites:</h3>
          <ul className="favorites-items">
            {notes
              .filter(note => favorites.includes(note.id))
              .map(note => (
                <li key={note.id}>{note.title}</li>
              ))}
          </ul>
        </div>
        <div className="theme-toggle">
          <button 
            onClick={toggleTheme}
            style={{ 
              backgroundColor: theme.buttonBackground, 
              color: themeButton.buttonColor 
            }}
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};