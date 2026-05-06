import React, { useEffect, useState, useRef } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const App = () => {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  // 🔐 Login
  const login = async () => {
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
  };

  // 🚪 Logout
  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  // 📩 Send Message
  const sendMessage = async () => {
    if (!msg.trim() || !user) return;

    await addDoc(collection(db, "messages"), {
      text: msg,
      uid: user.uid,
      name: user.displayName,
      photo: user.photoURL,
      createdAt: Date.now(),
    });

    setMsg("");
  };

  // 🔄 Real-time Messages
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  // 🔐 Auth persist
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔽 Auto scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center p-4">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-center">
        💬 Real-Time Chat App
      </h1>

      {/* Login */}
      {!user ? (
        <button
          onClick={login}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
        >
          Login with Google
        </button>
      ) : (
        <>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 bg-gray-800 px-4 py-2 rounded-full">
            <img
              src={user.photoURL}
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <p className="font-medium">{user.displayName}</p>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full text-sm"
            >
              Logout
            </button>
          </div>

          {/* MAIN LAYOUT */}
          <div className="w-full max-w-4xl flex gap-4 flex-col md:flex-row">

            {/* CHAT BOX */}
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold mb-2 text-green-400">
                📡 Live Chat
              </h2>

              <div
                ref={chatRef}
                className="h-[450px] overflow-y-auto bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col gap-2"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      m.uid === user.uid ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-xs text-gray-300">
                      {m.name}
                    </span>

                    <p
                      className={`px-3 py-2 rounded-lg max-w-[70%] shadow-md ${
                        m.uid === user.uid
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* INPUT BOX */}
            <div className="w-full md:w-1/3 flex flex-col">
              <h2 className="text-xl font-bold mb-2 text-blue-400 text-right">
                ✍️ Type Message
              </h2>

              <div className="flex flex-col gap-3 bg-gray-800 p-4 rounded-xl shadow-lg">

                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black outline-none"
                  placeholder="Write message..."
                />

                <button
                  onClick={sendMessage}
                  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg text-white font-medium"
                >
                  Send
                </button>

              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default App;