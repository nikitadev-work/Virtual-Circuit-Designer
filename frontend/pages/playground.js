"use client"

/* eslint-disable @next/next/no-page-custom-font */

import {useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';


export default function Page() {
    const searcParams = useSearchParams();
    const circuitId = searcParams.get("projectId");
    const [token, setToken] = useState(null);
    const [circuit, setCircuit] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("token")
        if (stored) setToken(stored)
    }, [])

    useEffect(() => {
        if (!token || !circuitId) return

        const HOST = window.location.host;
        fetch(`http://${HOST}:8052/api/circuits/${circuitId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                setCircuit(data)
            })
            .catch(console.error)
    }, [token, circuitId])

    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>VCD | Playground</title>

                {/* Favicon */}
                <link rel="shortcut icon" href="/Icons/Logos/favicon-black.png" type="image/png" />
                {/* Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <header className="header">
                <div className="left-controls">
                    <button id="back-dashboard" button className="settings-btn">
                        <Image src="/Icons/Logos/home.svg" width={40} height={40} className="home-vec"
                               alt="home"/>
                    </button>
                    <button id="leftbar-toggle" button className="components-btn">
                        <Image src="/Icons/Logos/components-vec.svg" width={25} height={25} className="components-vec"
                               alt="component"/>
                        Components
                    </button>
                </div>

                {circuit && (
                    <pre className="circuit-debug">{JSON.stringify(circuit, null, 2)}</pre>
                )}

                <div className="logo-wrapper">
                    <Image
                        src="/Icons/Logos/LogoCenter.svg"
                        alt="logo"
                        width={80}
                        height={75}
                        className="logo-img"
                    />
                    <span className="page-name">{circuit?.title || "Untitled"}</span>
                </div>

                <div className="right-controls">
                    <button className="user-logo">M</button>
                    <button id="rightbar-toggle" className="settings-btn">
                        <Image width={20} height={20} src="/Icons/Logos/settings.svg" alt="setting"/>
                    </button>
                    <button className="play-btn">
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

                            <div className="draggable-item" draggable="true" data-type="NOT" data-icon="/Icons/LogicBlocks/not.svg">
                                <Image src="/Icons/LogicBlocks/not.svg" width={60} height={60} alt="NOT" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="AND" data-icon="/Icons/LogicBlocks/and.svg">
                                <Image src="/Icons/LogicBlocks/and.svg" width={60} height={60} alt="AND" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="OR" data-icon="/Icons/LogicBlocks/or.svg">
                                <Image src="/Icons/LogicBlocks/or.svg" width={60} height={60} alt="OR" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="NAND" data-icon="/Icons/LogicBlocks/nand.svg">
                                <Image src="/Icons/LogicBlocks/nand.svg" width={60} height={60} alt="NAND" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="NOR" data-icon="/Icons/LogicBlocks/nor.svg">
                                <Image src="/Icons/LogicBlocks/nor.svg" width={60} height={60} alt="NOR" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="XNOR" data-icon="/Icons/LogicBlocks/xnor.svg">

                                <Image src="/Icons/LogicBlocks/xnor.svg" width={60} height={60} alt="xnor" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" data-type="XOR" data-icon="/Icons/LogicBlocks/xor.svg">
                                <Image src="/Icons/LogicBlocks/xor.svg" width={60} height={60} alt="XOR" className="component-icon"/>
                            </div>
                        </div>
                        {/* --- I/O -------------------------------------------------------------- */}
                        <div className="In-Out">I/O</div>
                        <div className="components-grid">
                            <div
                                className="draggable-item"
                                draggable="true"
                                data-type="INPUT"
                                data-icon="/Icons/Inputs&Outputs/Input-0.svg"
                            >
                                <Image src="/Icons/Inputs&Outputs/Input-0.svg" width={60} height={60} alt="Input" className="component-icon"/>
                            </div>

                            <div
                                className="draggable-item"
                                draggable="true"
                                data-type="OUTPUT"
                                data-icon="/Icons/Inputs&Outputs/Output-0.svg"
                            >
                                <Image src="/Icons/Inputs&Outputs/Output-0.svg" width={60} height={60} alt="Output" className="component-icon"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="playground-right-bar is-collapsed"></div>


                <div className="canvas-container" id="workspace">
                    <svg id="connections"></svg>
                </div>
            </section>

            <footer className="footer"></footer>

            <Script src="/js/connections.js" strategy="afterInteractive"/>
        </>
    );
}

