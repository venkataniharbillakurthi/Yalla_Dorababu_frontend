import React, { useEffect, useState } from 'react';
import { fetchContactMessages, deleteContactMessage } from '../utils/api';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch (err) {
      setMessages([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (err) {
      // Optionally handle error
    }
  };

  // Function to send message to WhatsApp
  const sendToWhatsApp = (msg) => {
    const phoneNumber = '918328657726'; // Replace with your WhatsApp number
    const text = `Name: ${msg.name}\nEmail: ${msg.email}\nMessage: ${msg.message}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  useEffect(() => { fetchMessages(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div><strong>Name:</strong> {msg.name}</div>
              <div><strong>Email:</strong> {msg.email}</div>
              <div><strong>Message:</strong> {msg.message}</div>
              <div><small>{msg.createdAt}</small></div>
            </div>
            <div className="flex items-center">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                onClick={() => sendToWhatsApp(msg)}
              >
                Send to WhatsApp
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(msg.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesManager; 