import React from 'react';

function LibraryPage() {
    React.useEffect(() => {
        document.title = "Library Page";
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./Sections/LibraryPage.css";
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link); // Cleanup
        };
    }, []);

    return (
        <div>
            <pre>
                <code id="codeBlock">
                    <div className="lineOfCode"><em>1200</em> Followers</div>
                    <div className="lineOfCode">
                        <strong>on</strong> <b>Threads</b> <u>🙏</u>
                    </div>
                    <div className="lineOfCode"><s>// Thank you !</s></div>
                </code>
            </pre>
        </div>
    );
}

export default LibraryPage;