import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { v1 as uuid } from 'uuid';
import { Todo } from './type';

const todosInitState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitState,
  reducers: {
    create: {
      reducer: (state, { payload }: PayloadAction<{ id: string; desc: string; isComplete: boolean }>) => {
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(),
          desc,
          isComplete: false,
        },
      }),
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const editingTodo = state.find((todo) => todo.id === payload.id);
      if (editingTodo) {
        editingTodo.desc = payload.desc;
      }
    },
    toggle: (state, { payload }: PayloadAction<{ id: string; isComplete: boolean }>) => {
      const togglingTodo = state.find((todo) => todo.id === payload.id);
      if (togglingTodo) {
        togglingTodo.isComplete = payload.isComplete;
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) =>
      state.filter((todo) => todo.id !== payload.id),
  },
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id,
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  remove: deleteTodoActionCreator,
  toggle: toggleTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
};

const Store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    const middlewares = [];
    if (process.env.NODE_ENV !== 'production') {
      middlewares.push(logger);
    }
    return [...getDefaultMiddleware(), ...middlewares];
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default Store;
