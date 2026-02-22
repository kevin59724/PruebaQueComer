import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OnboardingTutorial() {
    const { hasSeenTutorial, completeTutorial } = useAppStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const steps = [
        {
            targetSelector: null,
            title: '¡Bienvenido a QuéComer!',
            desc: 'Te daremos un breve tour interactivo. Empezaremos en la pestaña principal.',
            route: '/ruleta'
        },
        {
            targetSelector: '.tour-btn-generar',
            title: 'Genera tu semana',
            desc: 'Toca este botón para generar 7 comidas aleatorias al instante.',
            route: '/ruleta'
        },
        {
            targetSelector: '.tour-card-meal',
            title: 'Edita tus comidas',
            desc: 'Toca cualquier tarjeta para editar nombre, notas o regenerarla. También puedes arrastrarlas para ordenarlas.',
            route: '/ruleta'
        },
        {
            targetSelector: '.tour-btn-guardar',
            title: 'Guarda tus menús',
            desc: '¿Te gustó la semana? Guárdala aquí y la encontrarás en la pestaña Listas.',
            route: '/ruleta'
        },
        {
            targetSelector: '.tour-tab-base',
            title: 'Tu Base de Comidas',
            desc: 'Aquí puedes ver, agregar o desactivar platos. ¡Toca el ojo al lado de una categoría para excluirla de la ruleta!',
            route: '/base'
        },
        {
            targetSelector: '.tour-tab-menu',
            title: 'Opciones y Premium',
            desc: 'En Ajustes encontrarás opciones extra, como quitar los anuncios de por vida o dejarnos 5 estrellas. ¡Eso es todo!',
            route: '/menu'
        }
    ];

    useEffect(() => {
        if (hasSeenTutorial) return;

        // Navegar a la ruta correcta si es necesario
        if (location.pathname !== steps[currentStep].route) {
            navigate(steps[currentStep].route);
            return;
        }

        const selector = steps[currentStep].targetSelector;
        if (!selector) {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.querySelector(selector);
            if (el) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
            } else {
                setTargetRect(null);
            }
        };

        updateRect();
        const tid = setTimeout(updateRect, 400);
        window.addEventListener('resize', updateRect);
        return () => {
            clearTimeout(tid);
            window.removeEventListener('resize', updateRect);
        };
    }, [currentStep, hasSeenTutorial, location.pathname, navigate]);

    if (hasSeenTutorial) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTutorial();
        }
    };

    // Calcular posición del tooltip relativo al elemento iluminado
    // Siempre dentro del viewport
    const getCardStyle = () => {
        const CARD_HEIGHT = 220;
        const SIDE_MARGIN = 16;

        if (!targetRect) {
            // Pantalla completa / sin spotlight: centrar verticalmente
            return {
                bottom: '16px',
                left: `${SIDE_MARGIN}px`,
                right: `${SIDE_MARGIN}px`,
            };
        }

        const spaceBelow = window.innerHeight - (targetRect.top + targetRect.height);
        const spaceAbove = targetRect.top;

        if (spaceBelow >= CARD_HEIGHT + 20) {
            // Hay espacio debajo → poner debajo del elemento
            return {
                top: `${targetRect.top + targetRect.height + 14}px`,
                left: `${SIDE_MARGIN}px`,
                right: `${SIDE_MARGIN}px`,
            };
        } else if (spaceAbove >= CARD_HEIGHT + 20) {
            // Hay espacio arriba → poner encima del elemento
            return {
                top: `${targetRect.top - CARD_HEIGHT - 14}px`,
                left: `${SIDE_MARGIN}px`,
                right: `${SIDE_MARGIN}px`,
            };
        } else {
            // Sin espacio suficiente en ningún lado → poner en la parte inferior
            return {
                bottom: '16px',
                left: `${SIDE_MARGIN}px`,
                right: `${SIDE_MARGIN}px`,
            };
        }
    };

    return (
        <div className="fixed inset-0 z-[999] pointer-events-auto">
            {/* Fondo oscuro con agujero de spotlight */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: 'rgba(30,40,45,0.82)',
                    clipPath: targetRect
                        ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${targetRect.left - 10}px ${targetRect.top - 10}px, ${targetRect.left - 10}px ${targetRect.top + targetRect.height + 10}px, ${targetRect.left + targetRect.width + 10}px ${targetRect.top + targetRect.height + 10}px, ${targetRect.left + targetRect.width + 10}px ${targetRect.top - 10}px, ${targetRect.left - 10}px ${targetRect.top - 10}px)`
                        : 'none',
                    transition: 'clip-path 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
            />

            {/* Tarjeta posicionada dinámicamente */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="absolute bg-white rounded-3xl px-6 py-5 shadow-2xl"
                    style={getCardStyle()}
                >
                    {/* Progress dots */}
                    <div className="flex gap-1.5 justify-center mb-4">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className="h-1 rounded-full transition-all duration-300"
                                style={{
                                    width: i === currentStep ? '24px' : '6px',
                                    backgroundColor: i === currentStep ? '#e07a5f' : i < currentStep ? '#f2c4b5' : '#e5e7eb'
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between items-start mb-1.5">
                        <h3 className="font-extrabold text-brand-dark text-[17px] flex-1 leading-tight">{steps[currentStep].title}</h3>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full ml-3 whitespace-nowrap">{currentStep + 1}/{steps.length}</span>
                    </div>

                    <p className="text-[13px] font-medium text-brand-muted mb-5 leading-relaxed">
                        {steps[currentStep].desc}
                    </p>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => completeTutorial()}
                            className="text-[13px] font-bold text-gray-400 hover:text-gray-600 transition-colors py-2 px-1"
                        >
                            Saltar
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-brand-primary text-white text-[13px] font-bold px-6 py-2.5 rounded-2xl shadow-[0_4px_14px_-4px_#e07a5f] active:scale-95 transition-all"
                        >
                            {currentStep === steps.length - 1 ? '¡Comenzar!' : 'Siguiente →'}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
