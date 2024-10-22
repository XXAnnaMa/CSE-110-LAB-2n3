import { render, screen, fireEvent } from "@testing-library/react";
import { StickyNotes } from "./stickyNotes";
import { dummyNotesList } from "./constants";
import React from "react";

describe("StickyNotes", () => {
  test("creates and displays a new note", () => {
    render(<StickyNotes />);
    const titleInput = screen.getByTestId("note-title-input");
    const contentInput = screen.getByTestId("note-content-input");
    const createButton = screen.getByTestId("create-note-button");

    fireEvent.change(titleInput, { target: { value: "Test Note" } });
    fireEvent.change(contentInput, { target: { value: "Test Content" } });
    fireEvent.click(createButton);

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("updates an existing note", () => {
    render(<StickyNotes />);
    // Create a note first
    const titleInput = screen.getByTestId("note-title-input");
    const contentInput = screen.getByTestId("note-content-input");
    const createButton = screen.getByTestId("create-note-button");
  
    fireEvent.change(titleInput, { target: { value: "Original Title" } });
    fireEvent.change(contentInput, { target: { value: "Original Content" } });
    fireEvent.click(createButton);
  
    // Now update the note
    const editButton = screen.getByTestId("edit-note-button-1"); // Assuming the first note has id 1
    fireEvent.click(editButton);
  
    const titleElement = screen.getByTestId("note-title-edit-1");
    const contentElement = screen.getByTestId("note-content-edit-1");
  
    fireEvent.input(titleElement, { target: { innerHTML: "Updated Title" } });
    fireEvent.input(contentElement, { target: { innerHTML: "Updated Content" } });
  
    const saveButton = screen.getByTestId("save-note-button-1");
    fireEvent.click(saveButton);
  
    expect(screen.getByTestId("note-title-display-1")).toHaveTextContent("Updated Title");
    expect(screen.getByTestId("note-content-display-1")).toHaveTextContent("Updated Content");
  });
  
  test("deletes a note", () => {
    render(<StickyNotes />);
    
    const initialCount = dummyNotesList.length;

    // Create a new note
    const titleInput = screen.getByTestId("note-title-input");
    const contentInput = screen.getByTestId("note-content-input");
    const createButton = screen.getByTestId("create-note-button");
  
    fireEvent.change(titleInput, { target: { value: "Note to Delete" } });
    fireEvent.change(contentInput, { target: { value: "This will be deleted" } });
    fireEvent.click(createButton);
  
    // Verify that a new note is created
    const notesAfterCreation = screen.getAllByTestId(/^note-title-display-/);
    expect(notesAfterCreation.length).toBe(initialCount + 1);
  
    // Find the newly created note (it should be the last one)
    const newNote = notesAfterCreation[notesAfterCreation.length - 1];
    expect(newNote).toHaveTextContent("Note to Delete");
  
    // Get the id of the new note from its data-testid
    const dataTestId = newNote.getAttribute('data-testid');
    expect(dataTestId).not.toBeNull();
    
    if (dataTestId === null) {
      throw new Error("data-testid attribute is missing from the new note element");
    }

    const newNoteId = dataTestId.split('-').pop();
    expect(newNoteId).not.toBeUndefined();
    
    if (newNoteId === undefined) {
      throw new Error("Unable to extract note ID from data-testid");
    }
  
    // Delete the new note
    const deleteButton = screen.getByTestId(`delete-note-button-${newNoteId}`);
    fireEvent.click(deleteButton);
  
    // Verify that the note is deleted
    const notesAfterDeletion = screen.getAllByTestId(/^note-title-display-/);
    expect(notesAfterDeletion.length).toBe(initialCount);
    expect(screen.queryByText("Note to Delete")).not.toBeInTheDocument();
  });

  test("handles empty notes", () => {
    render(<StickyNotes />);
    
    const initialCount = dummyNotesList.length;
    
    const createButton = screen.getByTestId("create-note-button");
    fireEvent.click(createButton);
  
    // Verify that a new note is created
    const notesAfterCreation = screen.getAllByTestId(/^note-title-display-/);
    expect(notesAfterCreation.length).toBe(initialCount + 1);
  
    // The new note should be the last one
    const newNote = notesAfterCreation[notesAfterCreation.length - 1];
    expect(newNote).toHaveTextContent("Untitled");
    
    // Find the corresponding content element
    const newNoteId = newNote.getAttribute('data-testid')?.split('-').pop();
    expect(newNoteId).not.toBeUndefined();
    
    if (newNoteId === undefined) {
      throw new Error("Unable to extract note ID from data-testid");
    }
    
    const contentElement = screen.getByTestId(`note-content-display-${newNoteId}`);
    expect(contentElement).toHaveTextContent("No content");
  });

});