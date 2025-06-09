import { useState } from "react";

function AssistantPage() {
    const [messages, setMessages] = useState([]); // Trzymamy historię wiadomości
    const [inputMessage, setInputMessage] = useState(""); // Wiadomość użytkownika
    const [loading, setLoading] = useState(false); // Stan ładowania odpowiedzi

    const sendMessage = async () => {
        if (!inputMessage.trim()) return; // Jeśli pole tekstowe puste, nic nie wysyłamy

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: "user", content: inputMessage },
        ]);
        setLoading(true);
        setInputMessage("");

        // Wywołanie API do backendu
        try {
            console.log("Wysyłanie zapytania do backendu...");
            const response = await fetch("http://localhost:5000/chat", { // Zakładając, że masz /chat endpoint w backendzie
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: inputMessage, history: messages }), // Wysyłamy wiadomości i historię
            });

            console.log("Odpowiedź z backendu:", response);
            const data = await response.json();
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: "assistant", content: data.reply }, // Odpowiedź z backendu
            ]);
        } catch (error) {
            console.error("Błąd:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Asystent Filmowy</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index} className={msg.role}>
                        <strong>{msg.role === "user" ? "Ty:" : "GPT:"}</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                placeholder="Wpisz wiadomość..."
            />
            <button onClick={sendMessage} disabled={loading}>
                {loading ? "Ładowanie..." : "Wyślij"}
            </button>
        </div>
    );
}

export default AssistantPage;
