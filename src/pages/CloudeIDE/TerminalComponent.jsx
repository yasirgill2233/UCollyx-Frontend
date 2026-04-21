import React, { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = ({ socket }) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);

  // Frontend (React)
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     setIsConnected(true);
  //     // Jab server restart ho kar wapis connect ho, terminal ko saaf kar do
  //     term.clear();
  //     term.write('Terminal reconnected to server...\r\n');
  //   });

  //   socket.on('disconnect', () => {
  //     setIsConnected(false);
  //     term.write('\r\n[Terminal Disconnected - Reconnecting...]\r\n');
  //   });
  // }, []);

  useEffect(() => {
    const term = new XTerm({});
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();
    termInstance.current = term;

    const handleData = (data) => {
      term.write(data);
    };
    socket.on("terminal:data", handleData);

    const handleInput = (data) => {
      socket.emit("terminal:write", data);
    };
    const inputDisposable = term.onData(handleInput);

    // socket.on("connect", () => {
    //   setIsConnected(true);
    //   // Jab server restart ho kar wapis connect ho, terminal ko saaf kar do
    //   term.clear();
    //   term.write("Terminal reconnected to server...\r\n");
    //   socket.on("terminal:data", handleData);
    // });

    // socket.on("disconnect", () => {
    //   setIsConnected(false);
    //   term.write("\r\n[Terminal Disconnected - Reconnecting...]\r\n");
    // });

    return () => {
      socket.off("terminal:data", handleData);
      inputDisposable.dispose();
      term.dispose();
      termInstance.current = null;
    };
  }, [socket]);

  return <div ref={terminalRef} className="h-full w-full" />;
};

export default TerminalComponent;
