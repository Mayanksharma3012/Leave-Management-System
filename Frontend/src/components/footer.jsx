import './footer.css'

function Footer() {
    return (
        <div className="footer">
            <span>designed and coded by:</span>

            <div className="Details">
                <span>© 2026</span>
                <span className="name">Mayank Sharma</span>
            </div>
            <div className="Links">
                <a className="linkdin" href="https://www.linkedin.com" target="_blank" rel="noreferrer" title="Visit LinkedIn">
                    <i className="fa-brands fa-square-linkedin" aria-hidden="true"></i>
                </a>
                <a className="github" href="https://github.com" target="_blank" rel="noreferrer" title="Visit GitHub">
                    <i className="fa-brands fa-github" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    )
}

export default Footer