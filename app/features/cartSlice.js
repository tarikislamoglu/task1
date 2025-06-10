import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  activeProjectId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProject: (state, { payload }) => {
      state.cart.push(payload);
    },
    setActiveProject: (state, { payload }) => {
      state.activeProjectId = payload;
    },
    addBoardToActiveProject: (state, { payload }) => {
      const project = state.cart.find((p) => p.id === state.activeProjectId);
      if (project) {
        project.boards.push(payload);
      }
    },
    removeBoardFromActiveProject: (state, { payload }) => {
      const project = state.cart.find((p) => p.id === state.activeProjectId);
      if (project) {
        project.boards = project.boards.filter((b) => b.id !== payload);
      }
    },
    updateBoardComment: (state, { payload }) => {
      const { boardId, comment } = payload;
      const project = state.cart.find((p) => p.id === state.activeProjectId);
      if (project) {
        const board = project.boards.find((b) => b.id === boardId);
        if (board) {
          board.comments.push(comment);
        }
      }
    },
  },
});

export const {
  addProject,
  setActiveProject,
  addBoardToActiveProject,
  removeBoardFromActiveProject,
  updateBoardComment,
} = cartSlice.actions;

export const selectActiveProject = (state) =>
  state.cart.cart.find((p) => p.id === state.cart.activeProjectId);

export default cartSlice.reducer;
