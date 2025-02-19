import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import { sendClaimNotification } from '../utils/notificationService';

function Chat({ isAdmin = false }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'admin',
      content: 'สวัสดีครับ มีอะไรให้ช่วยไหมครับ?',
      timestamp: new Date('2024-02-19T10:00:00'),
      read: true,
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: isAdmin ? 'admin' : 'user',
      content: newMessage,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // แจ้งเตือน Push Notification
    if (!isAdmin) {
      sendClaimNotification('newMessage', {
        sender: 'ผู้ใช้',
        chatUrl: '/admin/claims'
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น');
      return;
    }

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    try {
      setIsUploading(true);

      // TODO: อัพโหลดไฟล์ไปยัง server
      const imageUrl = URL.createObjectURL(file);

      const message = {
        id: Date.now(),
        sender: isAdmin ? 'admin' : 'user',
        content: imageUrl,
        timestamp: new Date(),
        read: false,
        type: 'image',
        fileName: file.name
      };

      setMessages([...messages, message]);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
    } finally {
      setIsUploading(false);
      // รีเซ็ต input file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* หัวข้อแชท */}
      <div className="bg-gray-700 p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">แชทกับแอดมิน</h3>
          <p className="text-sm text-gray-400">
            {isAdmin ? 'คุยกับลูกค้า' : 'เราพร้อมให้ความช่วยเหลือ'}
          </p>
        </div>
        <button 
          onClick={() => setShowEmoji(!showEmoji)}
          className="text-gray-400 hover:text-white"
        >
          😊
        </button>
      </div>

      {/* กล่องแชท */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'admin' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'admin'
                  ? 'bg-gray-700'
                  : 'bg-blue-600'
              }`}
            >
              {message.type === 'text' ? (
                <p>{message.content}</p>
              ) : (
                <div className="space-y-2">
                  <img 
                    src={message.content} 
                    alt={message.fileName}
                    className="rounded-lg max-w-full"
                  />
                  <p className="text-xs text-gray-400">{message.fileName}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {format(message.timestamp, 'HH:mm', { locale: th })}
                {message.read && ' ✓✓'}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* ฟอร์มส่งข้อความ */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-4 py-2 bg-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition"
            disabled={isUploading}
          >
            {isUploading ? '📤' : '📎'}
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            ส่ง
          </button>
        </div>
      </form>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 right-0 bg-gray-700 p-2 rounded-lg shadow-lg">
          {/* TODO: เพิ่ม Emoji Picker Component */}
          <div className="grid grid-cols-8 gap-1">
            {'😊 😂 🤣 ❤️ 👍 😎 🎉 🔥'.split(' ').map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmoji(false);
                }}
                className="hover:bg-gray-600 p-1 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
