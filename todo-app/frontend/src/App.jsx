import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://be-todo-02240335.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await axios.get(`${API}/todos`);
      setTodos(res.data);
    };
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    await axios.post(`${API}/todos`, { task, description });
    setTask('');
    setDescription('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/todos/${id}`);
    fetchTodos();
  };

  const saveEdit = async (id) => {
    await axios.put(`${API}/todos/${id}`, { task: editTask, description: editDesc, completed: false });
    setEditId(null);
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${API}/todos/${todo.id}`, {
      task: todo.task,
      description: todo.description,
      completed: !todo.completed
    });
    fetchTodos();
  };

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const pending = total - done;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f0f5',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: '#111' }}>My To-Do List</h1>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: '0.95rem' }}>Stay organized. Get things done.</p>
          </div>
          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '0',
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
          }}>
            {[
              { label: 'TOTAL', value: total, color: '#111' },
              { label: 'DONE', value: done, color: '#22c55e' },
              { label: 'PENDING', value: pending, color: '#6366f1' },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: '14px 24px',
                textAlign: 'center',
                borderLeft: i > 0 ? '1px solid #e5e5e5' : 'none'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.65rem', color: '#aaa', fontWeight: '600', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Task Card */}
        <div style={{
          background: '#fff',
          colorScheme: 'light',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '1.1rem', fontWeight: '700' }}>Add New Task</h2>

          <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Title <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="What needs to be done?"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #e0e0e0',
              fontSize: '0.95rem',
              marginBottom: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />

          <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Description <span style={{ color: '#aaa', fontWeight: '400' }}>(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #e0e0e0',
              fontSize: '0.95rem',
              marginBottom: '20px',
              boxSizing: 'border-box',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />

          <button
            onClick={addTodo}
            style={{
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Add Task
          </button>
        </div>

        {/* Todo List Card */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          minHeight: '200px'
        }}>
          {todos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#bbb' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {todos.map(todo => (
                <li key={todo.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
                    style={{ marginTop: '4px', accentColor: '#6366f1', width: '16px', height: '16px' }}
                  />
                  {editId === todo.id ? (
                    <div style={{ flex: 1 }}>
                      <input
                        value={editTask}
                        onChange={e => setEditTask(e.target.value)}
                        style={{
                          width: '100%', padding: '8px', borderRadius: '8px',
                          border: '1px solid #e0e0e0', marginBottom: '8px',
                          boxSizing: 'border-box', fontSize: '0.9rem'
                        }}
                      />
                      <textarea
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        rows={2}
                        style={{
                          width: '100%', padding: '8px', borderRadius: '8px',
                          border: '1px solid #e0e0e0', marginBottom: '8px',
                          boxSizing: 'border-box', fontSize: '0.9rem', fontFamily: 'inherit'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => saveEdit(todo.id)} style={{
                          background: '#6366f1', color: '#fff', border: 'none',
                          borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.85rem'
                        }}>Save</button>
                        <button onClick={() => setEditId(null)} style={{
                          background: '#f0f0f0', color: '#555', border: 'none',
                          borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.85rem'
                        }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? '#aaa' : '#111'
                      }}>{todo.task}</div>
                      {todo.description && (
                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>
                          {todo.description}
                        </div>
                      )}
                    </div>
                  )}
                  {editId !== todo.id && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditId(todo.id); setEditTask(todo.task); setEditDesc(todo.description || ''); }}
                        style={{
                          background: '#f5f5f5', border: 'none', borderRadius: '8px',
                          padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', color: '#555'
                        }}>Edit</button>
                      <button onClick={() => deleteTodo(todo.id)}
                        style={{
                          background: '#fff0f0', border: 'none', borderRadius: '8px',
                          padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', color: '#e53e3e'
                        }}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;