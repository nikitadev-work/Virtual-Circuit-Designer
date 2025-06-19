import Head from 'next/head';
import Script from 'next/script';
import Image from 'next/image';


export default function Page() {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>VCD | Playground</title>

                {/* Favicon */}
                <link rel="shortcut icon" href="/favicon-black.png" type="image/png" />
                {/* Fonts */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <header className="header">
                <div className="left-controls">
                    <button className="insert-btn">
                        <Image src="/insert-vec.svg" width={25} height={25} className="insert-vec"  alt="vector"/>
                        Insert
                    </button>
                    <button id="leftbar-toggle" button className="components-btn">
                        <Image src="/components-vec.svg" width={25} height={25} className="components-vec"  alt="component"/>
                        Components
                    </button>
                </div>

                <button className="title-btn">Untitled</button>

                <div className="right-controls">
                    <button className="user-logo">M</button>
                    <button className="settings-btn">
                        <Image width={20} height={20} src="/settings.svg" alt="setting"/>
                    </button>
                    <button className="play-btn">
                        <Image width={20} height={20} src="/play.svg" alt="play"/>
                    </button>
                    <button className="export-btn">Export</button>
                    <button className="save-btn">Save</button>
                </div>
            </header>

            {/* Playground section */}
            <section className="playground">
                <div className="playground-left-bar is-collapsed">
                    <div className="logic-components">Logic Components</div>
                    <div className="components-grid">
                        <div className="draggable-item" draggable="true" data-type="NOT" data-icon="/Icons/not.png">
                            <Image src="/Icons/not.png" width={60} height={60} alt="NOT" className="component-icon"/>
                        </div>
                        <div className="draggable-item" draggable="true" data-type="AND" data-icon="/Icons/and.png">
                            <Image src="/Icons/and.png" width={60} height={60} alt="NOT" className="component-icon"/>
                        </div>
                        <div className="draggable-item" draggable="true" data-type="OR" data-icon="/Icons/or.png">
                            <Image src="/Icons/or.png" width={60} height={60} alt="NOT" className="component-icon"/>
                        </div>
                        <div className="draggable-item" draggable="true" data-type="NAND" data-icon="/Icons/nand.png">
                            <Image src="/Icons/nand.png" width={60} height={60} alt="NOT" className="component-icon"/>
                        </div>
                        <div className="draggable-item" draggable="true" data-type="NOR" data-icon="/Icons/nor.png">
                            <Image src="/Icons/nor.png" width={60} height={60} alt="NOT" className="component-icon"/>
                        </div>
                    </div>
                </div>

                <div className="playground-right-bar"></div>

                <div className="canvas-container" id="workspace">
                    <div className="canvas-background"></div>
                    <svg id="connections"></svg>
                </div>
            </section>

            <footer className="footer"></footer>

            <Script src="/js/connections.js" strategy="afterInteractive"/>
        </>
    );
}