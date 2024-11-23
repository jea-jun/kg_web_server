import React from 'react';
import './Sections/LibraryPage.css';
import { Helmet } from 'react-helmet';

function LibraryPage() {
    return (
        <div>
            {/* Head 내용은 Helmet으로 관리 */}
            <Helmet>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Library Page</title>
                <link rel="stylesheet" href="./Sections/LibraryPage.css" />
            </Helmet>

            {/* Body 내용 */}
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
