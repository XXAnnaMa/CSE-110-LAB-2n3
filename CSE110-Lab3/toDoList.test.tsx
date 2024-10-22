import { render, screen, fireEvent } from "@testing-library/react";
import { ToDoList } from "./toDoList";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

describe("ToDoList", () => {
  const renderWithRouter = (name = "Test") => {
    return render(
      <MemoryRouter initialEntries={[`/todolist/${name}`]}>
        <Routes>
          <Route path="/todolist/:name" element={<ToDoList />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("displays all items in the list", () => {
    renderWithRouter();
    expect(screen.getByText("Apples")).toBeInTheDocument();
    expect(screen.getByText("Bananas")).toBeInTheDocument();
  });

  test("updates number of checked items in the title", () => {
    renderWithRouter();
    expect(screen.getByText("Items bought: 0")).toBeInTheDocument();

    const appleCheckbox = screen.getByLabelText("Apples");
    fireEvent.click(appleCheckbox);

    expect(screen.getByText("Items bought: 1")).toBeInTheDocument();

    const bananaCheckbox = screen.getByLabelText("Bananas");
    fireEvent.click(bananaCheckbox);

    expect(screen.getByText("Items bought: 2")).toBeInTheDocument();

    fireEvent.click(appleCheckbox);

    expect(screen.getByText("Items bought: 1")).toBeInTheDocument();
  });

  test("displays the correct name in the title", () => {
    renderWithRouter("John");
    expect(screen.getByText("John's To Do List")).toBeInTheDocument();
  });
});