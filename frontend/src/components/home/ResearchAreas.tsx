import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCode, FiCpu, FiActivity, FiShield, FiDatabase, FiMessageSquare, FiLayers, FiGlobe } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const researchAreas = [
    {
        title: 'Language & Speech Processing',
        icon: <FiMessageSquare />,
        description: 'Machine Translation (Statistical & Neural), Speech Recognition, and Text-to-Speech synthesis for Bangla.'
    },
    {
        title: 'AI & Human-Computer Interaction',
        icon: <FiCpu />,
        description: 'Emotion recognition, computer vision, VR for autism and digital health solutions designed for people.'
    },
    {
        title: 'ICT for Development',
        icon: <FiGlobe />,
        description: 'Leveraging computing power to solve local challenges in agriculture, rural development, and maternal health.'
    },
    {
        title: 'Systems & Security',
        icon: <FiShield />,
        description: 'Exploring Wireless Networks, Distributed Computing, and Blockchain for secure, scalable infrastructure.'
    }
];

export default function ResearchAreas() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.research__content',
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%'
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="research section">
            <div className="container research__container">
                <div className="research__content">
                    <p className="vm-premium__label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <span style={{ display: 'block', width: 28, height: 1, background: 'var(--color-accent)' }} />
                        <span>Research Areas</span>
                    </p>
                    <h2 className="dept-editorial__title">
                        Research &amp;<br />
                        <span className="text-gradient">Innovation.</span>
                    </h2>
                    <p className="research__desc">
                        SUST CSE's research strength lies in bridging theoretical depth with practical application.
                        We are pioneers in NLP, HCI, and AI, engineering solutions that address the critical
                        challenges of the Fourth Industrial Revolution.
                    </p>
                    <a href="/research" className="dept-editorial__btn">
                        Explore Our Pillars →
                    </a>
                </div>

                <div className="research__slider-wrapper">
                    <div className="research__slider">
                        {[...researchAreas, ...researchAreas, ...researchAreas].map((area, index) => (
                            <div key={index} className="research-card">
                                <div className="research-card__icon">{area.icon}</div>
                                <h3 className="research-card__title">{area.title}</h3>
                                <p className="research-card__text">{area.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

