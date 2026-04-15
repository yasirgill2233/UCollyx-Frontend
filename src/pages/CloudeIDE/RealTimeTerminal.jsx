import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { io } from 'socket.io-client';

const RealtimeTerminal = () => {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // 1. Initialize Xterm
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#0c0c0e',
        foreground: '#a1a1aa',
        cursor: '#3b82f6',
        selectionBackground: '#3b82f640',
      },
      fontSize: 12,
      fontFamily: 'JetBrains Mono, monospace',
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    // 2. Initialize Socket Connection
    socketRef.current = io('http://localhost:5000'); // Backend URL

    // Backend se data receive kar ke terminal pe dikhana
    socketRef.current.on('terminal:data', (data) => {
      term.write(data);
    });

    // Terminal pe jo type ho wo backend ko bhejna
    term.onData((data) => {
      socketRef.current.emit('terminal:write', data);
    });

    return () => {
      term.dispose();
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div className="h-full w-full bg-[#0c0c0e] p-2 overflow-hidden">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
};

export default RealtimeTerminal;