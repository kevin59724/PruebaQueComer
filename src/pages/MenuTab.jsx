import { Star, Wand2, Share2, Info, Bell, Shield, Mail } from 'lucide-react';

export default function MenuTab() {
    const menuSections = [
        {
            title: "Soporte nuestro trabajo",
            items: [
                {
                    id: 'rate',
                    icon: Star,
                    label: 'Calificar la aplicación',
                    desc: 'Ayúdanos con 5 estrellas en Google Play',
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-50',
                    onClick: () => alert('Redirigiendo a Google Play...')
                },
                {
                    id: 'premium',
                    icon: Wand2,
                    label: 'Quitar anuncios (Premium)',
                    desc: 'Un único pago de 5 soles para eliminar publicidad ¡Para siempre!',
                    color: 'text-purple-500',
                    bg: 'bg-purple-50',
                    onClick: () => alert('Redirigiendo al flujo de pago...')
                },
                {
                    id: 'share',
                    icon: Share2,
                    label: 'Compartir la app',
                    desc: 'Recomienda QuéComer! a tus amigos y familia',
                    color: 'text-blue-500',
                    bg: 'bg-blue-50',
                    onClick: () => alert('Abriendo menú de compartir...')
                }
            ]
        },
        {
            title: "Cuenta y Ajustes",
            items: [
                {
                    id: 'notifications',
                    icon: Bell,
                    label: 'Notificaciones',
                    desc: 'Recordatorios para planificar tu semana',
                    color: 'text-brand-primary',
                    bg: 'bg-brand-light',
                    onClick: () => alert('Ajustes de notificaciones (Próximamente)')
                }
            ]
        },
        {
            title: "Acerca de",
            items: [
                {
                    id: 'contact',
                    icon: Mail,
                    label: 'Contacto de soporte',
                    desc: 'Escríbenos si tienes problemas o sugerencias',
                    color: 'text-emerald-500',
                    bg: 'bg-emerald-50',
                    onClick: () => alert('Abriendo cliente de correo...')
                },
                {
                    id: 'privacy',
                    icon: Shield,
                    label: 'Políticas de privacidad',
                    desc: 'Términos y condiciones de la app',
                    color: 'text-gray-500',
                    bg: 'bg-gray-100',
                    onClick: () => alert('Abriendo políticas de privacidad...')
                },
                {
                    id: 'version',
                    icon: Info,
                    label: 'Versión',
                    desc: 'v1.0.0 (BETA)',
                    color: 'text-gray-400',
                    bg: 'bg-gray-50',
                    onClick: () => { }
                }
            ]
        }
    ];

    return (
        <div className="p-5 pt-8 min-h-full pb-24">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-brand-dark">Ajustes</h1>
                <p className="text-brand-muted text-[13px] font-medium mt-0.5">Configura tu experiencia en QuéComer!</p>
            </div>

            <div className="space-y-8">
                {menuSections.map((section, idx) => (
                    <div key={idx}>
                        <h2 className="text-[12px] font-extrabold text-brand-muted uppercase tracking-wider mb-3 px-1">{section.title}</h2>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
                            {section.items.map((item, itemIdx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.id}
                                        onClick={item.onClick}
                                        className={`flex items-center gap-4 p-4 ${itemIdx !== section.items.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors cursor-pointer group`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg}`}>
                                            <Icon size={22} className={`${item.color} group-hover:scale-110 transition-transform`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[15px] font-bold text-brand-dark leading-tight">{item.label}</h3>
                                            <p className="text-[12px] text-gray-400 font-medium mt-0.5">{item.desc}</p>
                                        </div>
                                        {item.id !== 'version' && (
                                            <div className="text-gray-300 group-hover:text-brand-primary transition-colors pr-2">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-center flex flex-col items-center opacity-60">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center mb-3">
                    <Star className="text-brand-primary" fill="currentColor" size={20} />
                </div>
                <p className="text-[12px] font-bold text-brand-dark uppercase tracking-wide">QuéComer!</p>
                <p className="text-[10px] text-brand-muted font-medium mt-0.5">Hecho con ❤️ en Perú</p>
            </div>
        </div>
    );
}
