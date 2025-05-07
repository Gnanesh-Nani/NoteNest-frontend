import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Colors for notes
const cardColors = [
  'bg-red-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
  'bg-indigo-100',
  'bg-teal-100',
];

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { 'x-auth-token': token },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setTitle('');
    setContent('');
    setDueDate('');
    setSelectedNoteId(null);
    setIsOpen(true);
  };

  const openEditModal = (note) => {
    setIsEditing(true);
    setSelectedNoteId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setDueDate(note.dueDate ? new Date(note.dueDate).toISOString().split('T')[0] : '');
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/notes/${selectedNoteId}`,
          { title, content, dueDate },
          { headers: { 'x-auth-token': token } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/notes',
          { title, content, dueDate },
          { headers: { 'x-auth-token': token } }
        );
      }
      setIsOpen(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${id}/complete`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { 'x-auth-token': token },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && note.completed) ||
      (filterStatus === 'incomplete' && !note.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-300 to-green-300 animate-gradient p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 hover:scale-105 transition-transform duration-300">
          My Notes 📚
        </h1>
        <button
          onClick={handleLogout}
          className="relative group bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow-md overflow-hidden"
        >
          <span className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative">Logout</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 border rounded-lg w-full md:w-1/4 focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Notes</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
        <button
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          + New Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, idx) => (
          <div
            key={note._id}
            className={`p-5 rounded-xl shadow-md transition-transform transform hover:scale-105 hover:rotate-1 hover:translate-y-1 ${
              cardColors[idx % cardColors.length]
            } ${note.completed ? 'opacity-50 line-through' : ''}`}
          >
            <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
            <p className="text-gray-700 mb-4">{note.content}</p>
            {note.dueDate && (
              <p
                className={`text-sm mb-4 ${
                  new Date(note.dueDate) < new Date() ? 'text-red-500' : 'text-green-500'
                }`}
              >
                ⏰ Due: {new Date(note.dueDate).toLocaleDateString()}
              </p>
            )}
            <div className="flex gap-3">
              {!note.completed && (
                <button
                  onClick={() => handleComplete(note._id)}
                  className="bg-green-400 hover:bg-green-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => openEditModal(note)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-full text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-full text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    {isEditing ? 'Edit Note' : 'Add New Note'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea
                      placeholder="Content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        {isEditing ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Dashboard;