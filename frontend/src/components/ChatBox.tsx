import { useState } from "react";
import axios from "axios";
import './ChatBox.css'

interface Message{
    sender: 'user' | 'bot';
    text: string;
}

export default function ChatBox() {

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>('')

    const sendMessage = async () => {
        if(!input.trim()) return;

        const userMsg: Message = {sender: 'user', text: input}
        setMessages((prev) => [...prev, userMsg])

        try{
            const res = await axios.post('http://localhost:4000/api/chat', {
                message: input,
            })
            
            const botMsg: Message = {sender: 'bot', text: res.data.reply};
            setMessages((prev) => [...prev, botMsg]);
        } catch(err){
            setMessages((prev) => [
                ...prev,
                {sender: 'bot', text: 'Error talking to DeepSeek'},
            ])
        }
        setInput('')
    }

  return (
    <div className="chat-container">
        <div className="messages">
            {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.sender}`}>{msg.text}</div>
            ))}
        </div>
        <div className="input-box">
            <input
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
  )
}
