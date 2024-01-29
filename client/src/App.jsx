import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import Chat from './components/Chat';

//create a instance of socket.io-client
const socket = io.connect(import.meta.env.VITE_SOCKET_URI);

function App() {
  const nameRef = useRef("");
  const roomRef = useRef("");
  const [displayChat, setDisplayChat] = useState(false);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, room } = { name: nameRef.current.value, room: roomRef.current.value };
    console.log(name, room);
    await socket.emit('join_room', { name, room });
    setDisplayChat(true);
  };
  return (
    <>
      {displayChat && <Chat name={nameRef.current.value} room={roomRef.current.value} socket={socket} />}

      {!displayChat && <div className='flex h-screen items-center'><form className='flex flex-col w-4/12 border-2 p-8 items-center space-y-6 m-auto ' onSubmit={(e) => handleFormSubmit(e)}>
        <span className='text-2xl text-green-500'>Indhra Chats</span>
        <input className="focus-within:outline-none border-b-2 focus-within:border-b-green-500 " type="text" placeholder="enter your name" ref={nameRef} />
        <input className="focus-within:outline-none border-b-2 focus-within:border-b-green-500 " type="text" placeholder="Room id" ref={roomRef} />
        <button className='bg-green-500 p-2 text-white' type="submit">Join</button>
      </form></div>}
    </>
  )
}

export default App
