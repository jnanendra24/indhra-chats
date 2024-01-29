import React from 'react'
import { useState, useEffect, useRef } from 'react';
export default function Chat({ name, room, socket }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data.date)
            setMessages(prev => [...prev, { name: data.name, message: data.message, time: data.time }]);
        })
        return () => {
            socket.off('receive_message');
        };
    }, [socket])
    useEffect(() => {
        inputRef.current.focus();
    },[])
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const sendMessage = async () => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        await socket.emit('send_message', { name, room, message, time });
        setMessages(prev => [...prev, { name, message, time }]);
        setMessage("");
    }
    return (
        <div className='flex h-screen items-center'>
            <div className='flex flex-col border-2 w-5/12 m-auto'>
                <div className="chat-header flex justify-between text-xl h-12 bg-green-500 text-white"><h1 className='m-2'>Indhra Chats</h1><span className='m-2'>room: {room}</span></div>
                <div className="chat-window h-72 m-2 overflow-y-scroll scrollbar-hide">
                    <div className="output relative">
                        {messages.map((message, index) => {
                            return (
                                <div className={"flex " + (message.name === name && "flex-row-reverse")} key={index}>
                                    <div className={'flex flex-col rounded p-2'}>
                                        <span className='text-xs'>{message.name}</span>
                                        <p className={'rounded p-2 m-1 ' + (message.name === name ? "bg-slate-200" : "bg-green-500 text-white")}>
                                            {message.message}
                                        </p>
                                        <span className='text-xs self-end'>{message.time}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="chat-input flex justify-between m-4">
                    <input type="text"
                     className='focus-within:outline-none border-b-2 focus-within:border-green-500 w-10/12' placeholder='Type here...' 
                     value={message} 
                     onChange={(e) => { setMessage(e.target.value) }}
                     onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage() } }}
                     ref={inputRef}
                     />
                    <button className="bg-green-500 text-white p-2 rounded" onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}
