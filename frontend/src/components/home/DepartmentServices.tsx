import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        title: 'Consultancy',
        desc: 'Expert advice and strategic solutions for complex technological challenges.',
        icon: '💡'
    },
    {
        title: 'Training',
        desc: 'Comprehensive capacity building programs and specialized tech skill development.',
        icon: '🎯'
    },
    {
        title: 'Social Outreach',
        desc: 'Empowering communities through technology and driving sustainable digital impact.',
        icon: '🌍'
    }
];

export default function DepartmentServices() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !cardsRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                Array.from(cardsRef.current!.children),
                {
                    opacity: 0,
                    y: 40
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="dept-services section">
            <div className="container">
                <div className="section__header">
                    <h2 className="section__title">Department <span className="text-accent">Service</span></h2>
                    <p className="section__subtitle">
                        Beyond academics, we actively contribute to industry and society through dedicated service channels.
                    </p>
                </div>

                <div ref={cardsRef} className="dept-services__grid">
                    {services.map((service, index) => (
                        <div key={index} className="service-card">
                            <div className="service-card__icon">{service.icon}</div>
                            <h3 className="service-card__title">{service.title}</h3>
                            <p className="service-card__desc">{service.desc}</p>

                            <div className="service-card__border-glow" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
