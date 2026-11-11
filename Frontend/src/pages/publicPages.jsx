import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/footer'
import './landingPage.css'
import './publicPages.css'

export function PublicNavbar() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false)
    const closeMobileNav = () => setMobileNavOpen(false)

    return (
        <header className="landingNavbar">
            <Link to="/" className="left publicBrand" aria-label="LeaveManager home" onClick={closeMobileNav}>
                <span className="logo" aria-hidden="true"></span>
                <span className="brand-text">
                    <span className="name">LeaveManager</span>
                    <span className="tagline">Smart leave approval for modern teams</span>
                </span>
            </Link>

            <button
                type="button"
                className="landingMenuButton"
                aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileNavOpen}
                onClick={() => setMobileNavOpen((open) => !open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`right${mobileNavOpen ? ' mobileOpen' : ''}`}>
                <nav className="links" aria-label="Primary navigation">
                    <Link to="/#hero" onClick={closeMobileNav}>Home</Link>
                    <Link to="/#calendar" onClick={closeMobileNav}>Calendar</Link>
                    <Link to="/about" onClick={closeMobileNav}>About</Link>
                    <Link to="/pricing" onClick={closeMobileNav}>Pricing</Link>
                    <Link to="/contact" onClick={closeMobileNav}>Contact</Link>
                </nav>
                <div className="sign">
                    <Link to="/login" className="loginBtn" onClick={closeMobileNav}>Login</Link>
                    <Link to="/register" className="getStartedBtn" onClick={closeMobileNav}>Get Started</Link>
                </div>
            </div>
        </header>
    )
}

function PublicPageLayout({ eyebrow, title, description, children }) {
    return (
        <div className="publicSite" data-theme="light">
            <PublicNavbar />
            <main className="publicPage">
                <header className="publicPageHeader">
                    <p className="publicEyebrow">{eyebrow}</p>
                    <h1>{title}</h1>
                    <p className="publicPageIntro">{description}</p>
                </header>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export function AboutPage() {
    return (
        <PublicPageLayout
            eyebrow="About LeaveManager"
            title="Leave planning that works for everyone."
            description="LeaveManager gives employees and managers one clear place to plan time away, handle approvals, and keep the team in sync."
        >
            <section className="aboutFeatureGrid" aria-label="What LeaveManager helps with">
                <article className="publicInfoCard">
                    <span className="publicCardNumber">01</span>
                    <h2>Make requests simple</h2>
                    <p>Employees can submit leave requests and see their status without chasing updates across emails and chats.</p>
                </article>
                <article className="publicInfoCard">
                    <span className="publicCardNumber">02</span>
                    <h2>Help managers stay on top</h2>
                    <p>Managers can review requests, understand team availability, and make informed decisions from one workspace.</p>
                </article>
                <article className="publicInfoCard">
                    <span className="publicCardNumber">03</span>
                    <h2>Keep the team aligned</h2>
                    <p>A shared leave calendar makes upcoming time off easier to see and helps teams plan ahead with confidence.</p>
                </article>
            </section>
            <section className="publicCallout">
                <div>
                    <h2>Less admin. More clarity.</h2>
                    <p>LeaveManager is built to make everyday leave coordination feel straightforward.</p>
                </div>
                <Link className="publicAction" to="/register">Get started</Link>
            </section>
        </PublicPageLayout>
    )
}

const demoPlans = [
    {
        name: 'Starter',
        price: '$0',
        period: 'free',
        description: 'A simple starting point for small teams.',
        features: ['Leave request tracking', 'Team leave calendar', 'Manager approvals'],
    },
    {
        name: 'Team',
        price: '$5',
        period: 'per employee / month',
        description: 'More visibility for growing teams.',
        features: ['Everything in Starter', 'Team availability overview', 'Leave reports'],
        featured: true,
    },
    {
        name: 'Business',
        price: '$12',
        period: 'per employee / month',
        description: 'Extra room for larger organizations.',
        features: ['Everything in Team', 'Multiple manager workflows', 'Priority support'],
    },
]

export function PricingPage() {
    return (
        <PublicPageLayout
            eyebrow="Simple plans"
            title="Demo pricing for teams of every size."
            description="These sample plans show how LeaveManager pricing could be presented. They are for demonstration only."
        >
            <p className="pricingDemoNotice">Demo pricing only — no checkout, subscription, or payment is created.</p>
            <section className="pricingGrid" aria-label="Demo pricing plans">
                {demoPlans.map((plan) => (
                    <article className={`pricingCard${plan.featured ? ' featured' : ''}`} key={plan.name}>
                        {plan.featured && <span className="popularBadge">Popular</span>}
                        <h2>{plan.name}</h2>
                        <p className="planDescription">{plan.description}</p>
                        <p className="planPrice">
                            <strong>{plan.price}</strong>
                            <span>{plan.period}</span>
                        </p>
                        <ul>
                            {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                        </ul>
                        <Link className="publicAction" to="/register">Choose {plan.name}</Link>
                    </article>
                ))}
            </section>
        </PublicPageLayout>
    )
}

export function ContactPage() {
    return (
        <PublicPageLayout
            eyebrow="Contact"
            title="We'd love to hear from you."
            description="Have questions about managing leave with LeaveManager? Start by exploring the product, or create an account to see the experience for yourself."
        >
            <section className="contactPanel">
                <div className="contactIcon" aria-hidden="true">@</div>
                <div>
                    <h2>Need a hand getting started?</h2>
                    <p>This demo does not have a connected support inbox yet. You can explore the sample plans or create an account to continue.</p>
                    <div className="contactActions">
                        <Link className="publicAction" to="/register">Create an account</Link>
                        <Link className="publicTextLink" to="/pricing">View demo pricing</Link>
                    </div>
                </div>
            </section>
        </PublicPageLayout>
    )
}
