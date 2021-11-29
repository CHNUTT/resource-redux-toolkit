import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'uuid';
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
