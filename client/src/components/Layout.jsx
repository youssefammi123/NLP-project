import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './Layout.css';

function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isButtonVisible, setIsButtonVisible] = React.useState(true);
    const navigate = useNavigate();

    // Retrieve authentication status from localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    React.useEffect(() => {
        let lastScrollTop = 0;

        const handleScroll = () => {
            const currentScrollTop = window.scrollY;
            if (currentScrollTop > lastScrollTop) {
                setIsButtonVisible(false);
            } else {
                setIsButtonVisible(true);
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/sign-in');
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <a href="#" className="sidebar-logo">
                        <span className="sidebar-title">TalentQuest</span>
                    </a>
                </div>
                <nav className="sidebar-nav">
                    <div className="collapsible">
                        <div className="collapsible-trigger">
                            <Link to="/" className="sidebar-link">Home</Link>
                        </div>
                    </div>
                    {isAuthenticated && (
                        <>
                            <Link to="/resume-match" className="sidebar-link">ResumeMatch</Link>
                            <Link to="/quest-ai" className="sidebar-link">QuestAi</Link>
                            <Link to="/resume-quest" className="sidebar-link">ResumeQuest</Link>
                        </>
                    )}
                    <a href="#" className="sidebar-link">Settings</a>
                </nav>
                {isAuthenticated && (
                    <div className="sidebar-footer">
                        <button onClick={handleLogout} className="button-secondary">Logout</button>
                    </div>
                    )}
                
            </div>

            {/* Main Content */}
            <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                <header className="header">
                    <a href="#" className="header-logo">
                        <Link to="/" className="header-title">TalentQuest</Link>
                    </a>

                    <nav className="header-nav">
                        <a href="#" className="header-link">Home</a>
                        <a href="#" className="header-link">Features</a>
                        <a href="#" className="header-link">Pricing</a>
                        <a href="#" className="header-link">Contact</a>

                        <button className="button-primary">Get Started</button>
                    </nav>

                    <button
                        className={`sidebar-toggle ${isButtonVisible ? '' : 'hidden'}`}
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <FaBars />
                    </button>
                </header>

                <main>
                    <Outlet /> {/* This is where the routed content will be rendered */}
                </main>
            </div>
            <footer className={`footer ${isSidebarOpen ? 'shifted' : ''}`}>
                <div className="footer-content">
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <a href="#" className="footer-link">Terms of Service</a>
                    <a href="#" className="footer-link">Contact Us</a>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
