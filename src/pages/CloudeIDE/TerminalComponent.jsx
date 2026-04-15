import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { io } from 'socket.io-client';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Socket Connection (Backend URL use karein)
    socketRef.current = io('http://localhost:4001'); 

    // 2. XTerm Initialize
    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#09090b', // Match IDE background
        foreground: '#e4e4e7',
        cursor: '#3b82f6',
      },
      fontSize: 13,
      fontFamily: 'JetBrains Mono, Menlo, monospace',
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    // 3. Listen for Backend Data
    socketRef.current.on('terminal:data', (data) => {
      term.write(data);
    });

    // 4. Send Data to Backend
    term.onData((data) => {
      socketRef.current.emit('terminal:write', data);
    });

    // Handle Resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      socketRef.current.disconnect();
    };
  }, []);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default TerminalComponent;