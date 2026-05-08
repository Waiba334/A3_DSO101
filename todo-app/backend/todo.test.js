test('basic math works', () => {
  expect(1 + 1).toBe(2);
});

test('todo object has required fields', () => {
  const todo = { id: 1, task: 'Buy milk', completed: false };
  expect(todo).toHaveProperty('task');
  expect(todo).toHaveProperty('completed');
  expect(todo.completed).toBe(false);
});
