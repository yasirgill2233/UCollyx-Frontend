import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

const TerminalComponent = ({ socket }) => {
  const terminalRef = useRef(null);
  const termInstance = useRef(null);

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
