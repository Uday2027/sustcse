import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        title: 'Consultancy',
        desc: 'Expert advice and strategic solutions for complex technological challenges.',
        num: '01'
    },
    {
        title: 'Training',
        desc: 'Comprehensive capacity building programs and specialized tech skill development.',
        num: '02'
    },
    {
        title: 'Social Outreach',
        desc: 'Empowering communities through technology and driving sustainable digital impact.',
        num: '03'
    }
];

export default function DepartmentServices() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Watermark parallax
            gsap.to('.services-premium__watermark', {
                y: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            });

            // Title reveal
            gsap.fromTo('.services-premium__title-block',
                { opacity: 0, x: -50 },
                {
                    opacity: 1, x: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
                }
            );

            // Services list stagger
            gsap.fromTo('.services-premium__item',
                { opacity: 0, x: 50 },
                {
                    opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
                    scrollTrigger: { trigger: '.services-premium__list', start: 'top 75%' }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="section services-premium">
            <div className="container">
                <div className="services-premium__watermark">IMPACT</div>
                
                <div className="services-premium__layout">
                    <div className="services-premium__title-block">
                        <h2 className="dept-editorial__title">
                            Department<br />
                            <span className="text-gradient">Services.</span>
                        </h2>
                        <p className="services-premium__lead">
                            Beyond academics, we actively contribute to industry and society through dedicated service channels.
                        </p>
                    </div>

                    <div className="services-premium__list">
                        {services.map((service) => (
                            <div key={service.num} className="services-premium__item">
                                <span className="services-premium__num">{service.num}</span>
                                <div className="services-premium__content">
                                    <h3>{service.title}</h3>
                                    <p>{service.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
