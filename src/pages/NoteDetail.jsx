import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const NoteDetail = () => {
  const { id } = useParams();  // Get the note ID from the URL
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchNote = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
        headers: { 'x-auth-token': token },
      });

      if (res.data) {
        console.log('Fetched note:', res.data);  // Debugging line
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setDueDate(res.data.dueDate ? new Date(res.data.dueDate).toISOString().split('T')[0] : '');
      } else {
        console.error('No data received');
      }
    } catch (err) {
      console.error('Error fetching note:', err);
    }
  };

  useEffect(() => {
    if (id) fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${id}`,
        { title, content, dueDate },
        { headers: { 'x-auth-token': token } }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Note Details</h1>
      </div>

      {/* Note Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <textarea
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
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteDetail;
