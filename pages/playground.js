import Head from 'next/head';
import Script from 'next/script';


export default function Page() {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>VCD | Playground</title>
                {/* connection CSS file */}
                <link rel="stylesheet" href="/styles/style.css" />
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
                    <button className="icon-btn">
                        <img src="/Logo.svg" className="btn-logo"/>
                        <img src="/Vector.svg" className="arrow-vec" alt={""}/>
                    </button>
                    <button className="insert-btn">
                        <img src="/insert-vec.svg" className="insert-vec" />
                        Insert
                    </button>
                    <button className="components-btn">
                        <img src="/components-vec.svg" className="components-vec" />
                        Components
                    </button>
                </div>

                <button className="title-btn">Untitled</button>

                <div className="right-controls">
                    <button className="user-logo">M</button>
                    <button className="settings-btn">
                        <img src="/settings.svg" />
                    </button>
                    <button className="play-btn">
                        <img src="/play.svg" />
                    </button>
                    <button className="export-btn">Export</button>
                    <button className="save-btn">Save</button>
                </div>
            </header>

            {/* Playground section */}
            <section className="playground">
                <div className="playground-left-bar">
                    <div className="logic-components">Logic Components</div>

                    <div className="draggable-item" draggable="true" data-type="NOT" data-icon="./Icons/not.png">NOT
                    </div>
                    <div className="draggable-item" draggable="true" data-type="AND" data-icon="./Icons/and.png">AND
                    </div>
                    <div className="draggable-item" draggable="true" data-type="OR" data-icon="./Icons/or.png">OR</div>
                    <div className="draggable-item" draggable="true" data-type="NAND"
                         data-icon="./Icons/nand.png">NAND
                    </div>
                    <div className="draggable-item" draggable="true" data-type="NOR" data-icon="./Icons/nor.png">NOR
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
