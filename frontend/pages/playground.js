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

        const HOST = window.location.host
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
                <link rel="shortcut icon" href="/Icons/favicon-black.png" type="image/png" />
                {/* Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <header className="header">
                <div className="left-controls">
                    <button id="leftbar-toggle" button className="components-btn">
                        <Image src="Icons/components-vec.svg" width={25} height={25} className="components-vec"  alt="component"/>
                        Components
                    </button>
                </div>

                <div className="logo-wrapper">
                    <img src="/Icons/LogoCenter.svg" alt="logo" className="logo-img" />
                    <span className="page-name">Name of page</span>
                </div>

                <div className="right-controls">
                    <button className="user-logo">M</button>
                    <button id="rightbar-toggle" className="settings-btn">
                        <Image width={20} height={20} src="Icons/settings.svg" alt="setting"/>
                    </button>
                    <button className="play-btn">
                        <Image width={20} height={20} src="/Icons/play.svg" alt="play"/>
                    </button>

                    <button id="export-btn" className="export-btn">Export</button>
                    <button className="save-btn">Save</button>
                </div>
            </header>

            {/* Playground section */}
            <section className="playground">
                <div className="playground-left-bar is-collapsed">
                    {/* Всё, что прячем */}
                    <div className="sidebar-body">
                        <div className="logic-components">Logic Components</div>
                        <div className="components-grid">

                            <div className="draggable-item" draggable="true" datatype="NOT" data-icon="/Icons/LogicBlocks/not.svg">
                                <Image src="/Icons/LogicBlocks/not.svg" width={60} height={60} alt="NOT" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" datatype="AND" data-icon="/Icons/LogicBlocks/and.svg">
                                <Image src="/Icons/LogicBlocks/and.svg" width={60} height={60} alt="AND" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" datatype="OR" data-icon="/Icons/LogicBlocks/or.svg">
                                <Image src="/Icons/LogicBlocks/or.svg" width={60} height={60} alt="OR" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" datatype="NAND" data-icon="/Icons/LogicBlocks/nand.svg">
                                <Image src="/Icons/LogicBlocks/nand.svg" width={60} height={60} alt="NAND" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" datatype="NOR" data-icon="/Icons/LogicBlocks/nor.svg">
                                <Image src="/Icons/LogicBlocks/nor.svg" width={60} height={60} alt="NOR" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" datatype="XNOR" data-icon="/Icons/LogicBlocks/xnor.svg">

                                <Image src="/Icons/LogicBlocks/xnor.svg" width={60} height={60} alt="xnor" className="component-icon"/>
                            </div>
                            <div className="draggable-item" draggable="true" datatype="XOR" data-icon="/Icons/LogicBlocks/xor.svg">
                                <Image src="/Icons/LogicBlocks/xor.svg" width={60} height={60} alt="XOR" className="component-icon"/>
                            </div>
                        </div>
                        {/* --- I/O -------------------------------------------------------------- */}
                        <div className="In-Out">I/O</div>
                        <div className="components-grid">
                            <div
                                className="draggable-item"
                                draggable="true"
                                datatype="INPUT"
                                data-icon="/Icons/Inputs&Outputs/Input-0.svg"
                            >
                                <Image src="/Icons/Inputs&Outputs/Input-0.svg" width={60} height={60} alt="Input" className="component-icon"/>
                            </div>

                            <div
                                className="draggable-item"
                                draggable="true"
                                datatype="OUTPUT"
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

