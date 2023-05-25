import { useEffect, useState, useRef } from "react";
import socket from "./socket";

const F_ConsolePage = function ({
    server: {
        serverId,
        consoleArray = [],
        status = "Stopped",
        resourceUsage: { memory = 0, cpu = 0, elapsed = 0 },
    },
}) {
    const [consoleOutput, setConsoleOutput] = useState(consoleArray);
    const [serverStatus, setServerStatus] = useState(status);
    const [memoryUsage, setMemoryUsage] = useState(memory);
    const [cpuUsage, setCpuUsage] = useState(cpu);
    const [upTime, setUpTime] = useState(elapsed);
    const panelRef = useRef(null);

    useEffect(() => {
        socket.on("serverUpdate", (server) => {
            if (server.serverId != serverId) return;
            setConsoleOutput(server.consoleArray);
            setServerStatus(server.status);
            setMemoryUsage(server.resourceUsage.memory);
            setCpuUsage(server.resourceUsage.cpu);
            setUpTime(server.resourceUsage.elapsed);
            panelRef.current.scrollTop = panelRef.current.scrollHeight + 10;
        });

        return () => {
            socket.off("serverUpdate");
            socket.disconnect();
        };
    }, []);

    const handleSendCommand = (command) => {
        socket.emit("serverCommand", { serverId, command });
    };

    const handleConsoleSubmit = (event) => {
        event.preventDefault();
        handleSendCommand(event.target.consoleInput.value);
        event.target.consoleInput.value = "";
    };

    return (
        <div>
            <div className="console" ref={panelRef}>
                {consoleOutput.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>
            <form onSubmit={handleConsoleSubmit}>
                <input
                    type="text"
                    name="consoleInput"
                    className="console-input"
                    placeholder="Type your command here..."
                />
                <button type="submit" className="console-submit">
                    Submit
                </button>
            </form>

            <div className="container">
                <div className="status-panel">
                    <h2>Server Status</h2>
                    <p>
                        Id: <span id="status">{serverId}</span>
                        <br />
                        Status: <span id="status">{serverStatus}</span>
                    </p>
                </div>
                <div className="control-buttons">
                    <button
                        className="control-button"
                        id="startButton"
                        onClick={() => handleSendCommand("$panel:start")}
                    >
                        Start
                    </button>
                    <button
                        className="control-button"
                        id="stopButton"
                        onClick={() => handleSendCommand("$panel:stop")}
                    >
                        Stop
                    </button>
                    <button
                        className="control-button"
                        id="killButton"
                        onClick={() => handleSendCommand("$panel:kill")}
                    >
                        Kill
                    </button>
                </div>
                <div className="monitor-panel">
                    <h2>RAM Usage:</h2>
                    <p>
                        <span id="ramUsage">
                            {(memoryUsage / (1024 * 1024) || 0).toFixed(2)}
                        </span>{" "}
                        MB
                    </p>
                    <br />
                    <h2 style={{ marginLeft: 10 + "px" }}>CPU Usage:</h2>
                    <p>
                        <span id="cpuUsage">{(cpuUsage || 0).toFixed(2)}</span>%
                    </p>
                    <br />
                    <h2 style={{ marginLeft: 10 + "px" }}>Up Time:</h2>
                    <p>
                        <span id="cpuUsage">
                            {(upTime / 1000 || 0).toFixed(2)}
                        </span>{" "}
                        seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

export default F_ConsolePage;

export async function getServerSideProps(ctx) {
    return {
        props: ctx.query,
    };
}
