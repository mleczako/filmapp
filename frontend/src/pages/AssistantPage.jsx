import { useState, useRef, useEffect } from "react";
import '../css/AssistantPage.css'; // Importujemy plik CSS

function AssistantPage() {
    const [messages, setMessages] = useState([]); // Historia wiadomości
    const [inputMessage, setInputMessage] = useState(""); // Wiadomość użytkownika
    const [loading, setLoading] = useState(false); // Stan ładowania
    const chatContainerRef = useRef(null); // Referencja do kontenera czatu

    // Funkcja wysyłania wiadomości
    const sendMessage = async () => {
        if (!inputMessage.trim()) return; // Jeśli wiadomość jest pusta, nic nie wysyłamy

        // Dodaj wiadomość użytkownika do historii
        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: inputMessage },
        ]);
        setLoading(true);
        setInputMessage(""); // Czyści pole wejściowe

        try {
            const response = await fetch("http://localhost:5000/chat", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: inputMessage, history: messages }), // Przesyłamy wiadomość i historię
            });

            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: data.reply }, // Dodaj odpowiedź asystenta do historii
            ]);
        } catch (error) {
            console.error("Błąd:", error); // Logujemy błędy
        } finally {
            setLoading(false);
        }
    };

    // Funkcja do przewijania czatu na dół
    const scrollToBottom = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight; // Przewija na dół
        }
    };

    // Automatyczne przewijanie czatu po każdej nowej wiadomości
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Obsługa wysyłania wiadomości po naciśnięciu Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            sendMessage();
        }
    };

    return (
        <div className="assistant-page">
            <div className="chat-container">
                <h1>Asystent Filmowy</h1>
                <div 
                    ref={chatContainerRef} 
                    className="chat-box"
                >
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            <strong>{msg.role === "user" ? "Ty:" : "GPT:"}</strong> {msg.content}
                        </div>
                    ))}
                    {loading && (
                        <div className="message assistant">
                            <strong>GPT:</strong> <em>Pisze odpowiedź...</em>
                        </div>
                    )}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        placeholder="Wpisz wiadomość..."
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        {loading ? "Ładowanie..." : "Wyślij"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AssistantPage;