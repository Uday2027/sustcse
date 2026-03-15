import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const researchAreas = [
    'Algorithms and Theory',
    'AI and Machine Learning',
    'Bioinformatics',
    'Cyber Security',
    'Database and Data Science',
    'Natural Language Processing',
    'Software Engineering',
    'Systems and Networking'
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
                    <h2 className="section__title">
                        <span className="text-accent">Research</span> <span style={{ color: '#FDFBD4' }}>Areas</span>
                    </h2>
                    <p className="research__desc">
                        From developing cyber security solutions to recommending potential medicine through AI,
                        our researchers solve problems that impact the world. Our expertise spans multiple disciplines,
                        driving innovation at the bleeding edge of technology to forge a better tomorrow.
                    </p>
                    <a href="/research" className="research__btn">
                        Explore Publications
                    </a>
                </div>

                <div className="research__slider-wrapper">
                    {/* We duplicate the areas array to create a seamless infinite scroll effect */}
                    <div className="research__slider">
                        {[...researchAreas, ...researchAreas].map((area, index) => (
                            <div key={index} className="research-card">
                                <div className="research-card__inner">
                                    <h3 className="research-card__title">{area}</h3>
                                    <div className="research-card__arrow">→</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
