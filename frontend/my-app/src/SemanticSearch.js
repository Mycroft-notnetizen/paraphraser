import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SemanticSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedSession = localStorage.getItem('sb-demoadmin-auth-token');
        if (storedSession) {
            try {
                const parsedSession = JSON.parse(storedSession);
                if (parsedSession && parsedSession.access_token) {
                    setToken(parsedSession.access_token);
                }
            } catch (error) {
                console.error("Error parsing session from localStorage:", error);
            }
        }
    }, []);

    const handleSearch = async () => {
        if (!token) {
            console.error('No token available. Aborting request.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/semantic-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ query, threshold: 0.3 }),
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                setResults(['Error: Failed to perform semantic search.']);
            }
        } catch (error) {
            setResults([`Error: ${error.message}`]);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Semantic Search</h1>
            <textarea
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.textarea}
            />
            <button onClick={handleSearch} style={styles.button}>Search</button>
            <div style={styles.resultsContainer}>
                {results.map((result, index) => (
                    <div key={index} style={styles.result}>{JSON.stringify(result)}</div>
                ))}
            </div>
            <Link to="/" style={styles.link}>Back to Chat</Link>
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
    textarea: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#ecf0f1',
        color: '#2c3e50',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#27ae60',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    resultsContainer: {
        marginTop: '20px',
        backgroundColor: '#34495e',
        borderRadius: '8px',
        padding: '10px',
    },
    result: {
        backgroundColor: '#2ecc71',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    link: {
        display: 'block',
        marginTop: '20px',
        color: '#3498db',
        textDecoration: 'none',
    },
};

export default SemanticSearch;