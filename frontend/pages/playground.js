"use client"

/* eslint-disable @next/next/no-page-custom-font */

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";

import {BackToDashboardButton} from "../src/components/BackToDashboardButton";

import Head from 'next/head';
import Image from 'next/image';


export default function Page() {
    const searchParams = useSearchParams();
    const circuitId = searchParams.get("projectId");
    const [token, setToken] = useState(null);
    const [circuit, setCircuit] = useState(null);
    const [snapEnabled, setSnapEnabled] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("token")
        if (!stored) return;
        setToken(stored);
        try {
            const payload = JSON.parse(atob(stored.split(".")[1]));
            if (payload?.user_id) {
                localStorage.setItem("user_id", String(payload.user_id));
            }
        } catch { /* некорректный токен – просто пропускаем */
        }
    }, []);

    useEffect(() => {
        if (!token || !circuitId) return;

        if (!token || !circuitId) return;
        const userIdStr = localStorage.getItem("user_id");
        if (!userIdStr) return;
        const userId = Number(userIdStr);
        if (!Number.isFinite(userId)) return;
        const HOST = window.location.hostname;

        fetch(`http://${HOST}:8052/api/circuits/${circuitId}?user_id=${userId}`, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then((res) => res.json())
            .then((data) => {
                setCircuit(data);
            })
            .catch(console.error);
    }, [token, circuitId]);


    useEffect(() => {
        if (circuitId) {
            window.savedCircuitId = circuitId;
            localStorage.setItem('savedCircuitId', circuitId);
        }
    }, [circuitId]);

    useEffect(() => {
        if (circuit || !token || !circuitId) return;

        function parseJwt(token) {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch {
                return null;
            }
        }

        const parsed = parseJwt(token);
        const userId = parsed?.user_id ?? "guest";
        const key = `projects-${userId}`;
        const saved = localStorage.getItem(key);

        if (saved) {
            try {
                const list = JSON.parse(saved);
                const found = list.find(p => p.id === circuitId);
                if (found) {
                    setCircuit(found);
                }
            } catch (e) {
                console.error("Ошибка чтения схемы из localStorage", e);
            }
        }
    }, [circuit, token, circuitId]);

    useEffect(() => {
        if (!circuit || typeof window === "undefined") return;

        const gates = circuit.gates ?? circuit.circuit_description;
        const coordinates = circuit.coordinates ?? circuit.circuit_coordinates ?? [];
        const inputs = circuit.inputs ?? circuit.circuit_inputs ?? [];

        if (Array.isArray(gates) && typeof window.renderFromLocal === "function") {
            window.renderFromLocal(gates, inputs, coordinates);
        } else {
            console.warn("renderFromLocal is not available or gates missing");
        }
    }, [circuit]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/js/connections.js";
        script.async = true;
        script.onload = () => {
            console.log("connections.js loaded");
            if (typeof window.initPlayground === "function") {
                window.initPlayground();
            }
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        window.snapToGridEnabled = snapEnabled;
    }, [snapEnabled]);

    return (
        <>
            <Head>
                <meta charSet="UTF-8"/>
                <title>VCD | Playground</title>

                {/* Favicon */}
                <link rel="shortcut icon" href="/Icons/Logos/favicon-black.png" type="image/png"/>
                {/* Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <header className="header">
                <div className="left-controls">
                    <BackToDashboardButton/>
                    <button id="leftbar-toggle" button className="components-btn">
                        <Image src="/Icons/Logos/components-vec.svg" width={25} height={25} className="components-vec"
                               alt="component"/>
                        Components
                    </button>
                </div>


                <div className="logo-wrapper">
                    <Image
                        src="/Icons/Logos/LogoCenter.svg"
                        alt="logo"
                        width={80}
                        height={75}
                        className="logo-img"
                    />
                    <span className="page-name">
                        {decodeURIComponent(searchParams.get('title') || circuit?.circuit_name || "Untitled")}
                    </span>
                </div>

                <div className="right-controls">
                    <button className="user-logo">M</button>
                    
                    <button id="rightbar-toggle" className="settings-btn">
                        <Image width={20} height={20} src="/Icons/Logos/settings.svg" alt="setting"/>
                    </button>

                    <button id="play-btn" className="play-btn">
                        <Image width={20} height={20} src="/Icons/Logos/play.svg" alt="play"/>
                    </button>

                    <button id="export-btn" className="export-btn">Export</button>
                    <button id="save-btn" className="save-btn">Save</button>
                </div>
            </header>

            {/* Playground section */}
            <section className="playground">
                <div className="playground-left-bar is-collapsed">
                    {/* Всё, что прячем */}
                    <div className="sidebar-body">
                        <div className="logic-components">Logic Components</div>
                        <div className="components-grid">

                            <div className="draggable-item" draggable="true" data-type="NOT"
                                 data-icon="/Icons/LogicBlocks/not.svg">
                                <Image src="/Icons/LogicBlocks/not.svg" width={60} height={60} alt="NOT"
                                       className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="AND"
                                 data-icon="/Icons/LogicBlocks/and.svg">
                                <Image src="/Icons/LogicBlocks/and.svg" width={60} height={60} alt="AND"
                                       className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="OR"
                                 data-icon="/Icons/LogicBlocks/or.svg">
                                <Image src="/Icons/LogicBlocks/or.svg" width={60} height={60} alt="OR"
                                       className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="NAND"
                                 data-icon="/Icons/LogicBlocks/nand.svg">
                                <Image src="/Icons/LogicBlocks/nand.svg" width={60} height={60} alt="NAND"
                                       className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="NOR"
                                 data-icon="/Icons/LogicBlocks/nor.svg">
                                <Image src="/Icons/LogicBlocks/nor.svg" width={60} height={60} alt="NOR"
                                       className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="XNOR"
                                 data-icon="/Icons/LogicBlocks/xnor.svg">

                                <Image src="/Icons/LogicBlocks/xnor.svg" width={60} height={60} alt="xnor"
                                       className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="XOR"
                                 data-icon="/Icons/LogicBlocks/xor.svg">
                                <Image src="/Icons/LogicBlocks/xor.svg" width={60} height={60} alt="XOR"
                                       className="component-icon"/>
                            </div>
                        </div>
                        {/* --- I/O -------------------------------------------------------------- */}
                        <div className="In-Out">I/O</div>
                        <div className="components-grid">
                            <div
                                className="draggable-item"
                                draggable="true"
                                data-type="INPUT"
                                data-icon="/Icons/Inputs&Outputs/INPUT-0.svg"
                            >
                                <Image src="/Icons/Inputs&Outputs/INPUT-0.svg" width={60} height={60} alt="Input"
                                       className="component-icon"/>
                            </div>

                            <div
                                className="draggable-item"
                                draggable="true"
                                data-type="OUTPUT"
                                data-icon="/Icons/Inputs&Outputs/OUTPUT-0.svg"
                            >
                                <Image src="/Icons/Inputs&Outputs/OUTPUT-0.svg" width={60} height={60} alt="Output"
                                       className="component-icon"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="playground-right-bar is-collapsed">
                    <div className="sidebar-tail">
                        <button
                            className={`export-btn${snapEnabled ? '' : ' disabled'}`}
                            style={{
                                backgroundColor: snapEnabled ? '#0099FF' : '#f3f3f3',
                                color: snapEnabled ? 'white' : 'black',
                                border: snapEnabled ? '2px solid #0099FF' : '2px solid #ccc',
                                margin: 16,
                                width: 'auto',
                                minWidth: 120,
                                fontWeight: 500,
                                fontSize: 15
                            }}
                            onClick={() => setSnapEnabled(v => !v)}
                        >
                            Snap to grid: {snapEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>


                <div className="canvas-container" id="workspace">
                    <svg id="connections"></svg>
                </div>
            </section>

            <footer className="footer"></footer>

        </>
    );
}

