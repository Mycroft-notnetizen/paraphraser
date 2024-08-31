import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FrontPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [file, setFile] = useState(null);

    const handleSend = async () => {
        let newMessage = { type: 'user', content: inputText || (file ? file.name : '') };
        setMessages([...messages, newMessage]);

        const formData = new FormData();
        if (file) {
            formData.append('file', file, file.name);
            console.log('File appended:', file.name);
        } else if (inputText) {
            formData.append('text', inputText);
            console.log('Text appended:', inputText);
        }

        try {
            const response = await fetch('http://localhost:8000/paraphrase', {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                setMessages([...messages, newMessage, { type: 'bot', content: data.paraphrased }]);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setMessages([...messages, newMessage, { type: 'bot', content: `Error: ${errorText}` }]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessages([...messages, newMessage, { type: 'bot', content: `Error: ${error.message}` }]);
        }
        setInputText('');
        setFile(null);
    };

    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>AI Paraphrasing Chat</h1>
            <div style={styles.chatContainer}>
                {messages.map((message, index) => (
                    <div key={index} style={message.type === 'user' ? styles.userMessage : styles.botMessage}>
                        {message.content}
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <textarea
                    placeholder="Enter text here..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={styles.textarea}
                />
                {file && (
                    <div style={styles.fileDisplay}>
                        Uploaded file: {file.name}
                    </div>
                )}
                <div style={styles.buttonContainer}>
                    <label htmlFor="file-upload" style={styles.fileUploadLabel}>
                        📎 Upload
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileUpload}
                        style={styles.fileInput}
                    />
                    <button onClick={handleSend} style={styles.button}>Send</button>
                </div>
            </div>
            <Link to="/semantic-search" style={styles.link}>Go to Semantic Search</Link>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: 'auto',
        backgroundColor: '#2c3e50',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        color: '#ecf0f1',
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        textAlign: 'center',
    },
    chatContainer: {
        height: '400px',
        overflowY: 'auto',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#34495e',
        borderRadius: '8px',
    },
    userMessage: {
        backgroundColor: '#3498db',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
        maxWidth: '70%',
        alignSelf: 'flex-end',
        marginLeft: 'auto',
    },
    botMessage: {
        backgroundColor: '#2ecc71',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
        maxWidth: '70%',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#ecf0f1',
        color: '#2c3e50',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    fileUploadLabel: {
        padding: '10px 20px',
        backgroundColor: '#e67e22',
        color: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    fileInput: {
        display: 'none',
    },
    fileDisplay: {
        marginBottom: '10px',
        color: '#ecf0f1',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#27ae60',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    link: {
        display: 'block',
        marginTop: '20px',
        color: '#3498db',
        textDecoration: 'none',
    },
};

export default FrontPage;
