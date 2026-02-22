import { NavLink } from 'react-router-dom';
import { Utensils, ListTodo, BookOpen, User } from 'lucide-react';
import clsx from 'clsx';

export default function BottomMenu() {
    const tabs = [
        { to: '/ruleta', icon: Utensils, label: 'Ruleta' },
        { to: '/listas', icon: ListTodo, label: 'Listas' },
        { to: '/base', icon: BookOpen, label: 'Base' },
        { to: '/menu', icon: User, label: 'Ajustes' },
    ];

    return (
        <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-brand-light shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] px-6 py-3 pb-safe">
            <ul className="flex justify-between items-center max-w-sm mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <li key={tab.to}>
                            <NavLink
                                to={tab.to}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 gap-1',
                                        tab.to === '/menu' ? 'tour-tab-menu' : '',
                                        tab.to === '/base' ? 'tour-tab-base' : '',
                                        isActive
                                            ? 'text-brand-primary font-medium scale-105'
                                            : 'text-brand-muted hover:text-brand-dark'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon strokeWidth={isActive ? 2.5 : 2} size={24} className={isActive ? 'drop-shadow-sm' : ''} />
                                        <span className="text-[10px] tracking-wide">{tab.label}</span>
                                        {isActive && (
                                            <span className="w-1 h-1 rounded-full bg-brand-primary absolute -bottom-1"></span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
