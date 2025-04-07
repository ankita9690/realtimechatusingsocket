import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://realtimechatusingsocket.onrender.com'); // Change to your Render backend URL after deploy

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const bottomRef = useRef(null);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('send_message', message);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      setChat((prev) => [...prev, { text: msg.text, fromSelf: msg.id === socket.id }]);
    });

    return () => socket.off('receive_message');
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💬 Real-Time Chat</h2>
      <div style={styles.chatBox}>
      {chat.map((msg, i) => (
  <div key={i} style={styles.messageWrapper}>
    <div style={styles.bubble(msg.fromSelf)}>
      <span>{msg.text}</span>
    </div>
  </div>
))}

        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

export default App;

const styles = {
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 20,
    fontFamily: 'Arial',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  messageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 8,
  },
  
  chatBox: {
    border: '1px solid #ccc',
    borderRadius: 10,
    padding: 10,
    height: 400,
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
  },
  bubble: (self) => ({
    background: self ? '#dcf8c6' : '#ffffff',
    alignSelf: self ? 'flex-end' : 'flex-start',
    padding: '8px 12px',
    borderRadius: 20,
    maxWidth: '70%',
    margin: '5px 0',
    marginLeft: self ? 'auto' : 0,
    marginRight: self ? 0 : 'auto',
    display: 'inline-block',
  }),
  form: {
    display: 'flex',
    marginTop: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: '1px solid #ccc',
    marginRight: 10,
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
