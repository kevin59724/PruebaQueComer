import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, CalendarDays } from 'lucide-react';
import clsx from 'clsx';

export default function SavedListsTab() {
    const { savedLists, deleteSavedList, loadSavedList } = useAppStore();
    const navigate = useNavigate();

    const handleLoad = (id) => {
        if (confirm('¿Cargar esta lista? Reemplazará la lista actual en la ruleta.')) {
            loadSavedList(id);
            navigate('/ruleta');
        }
    };

    return (
        <div className="p-5 pt-8 min-h-full pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-brand-dark flex items-center gap-2">
                    Mis Listas
                </h1>
                <p className="text-brand-muted text-[13px] font-medium mt-0.5">Historial de menús guardados</p>
            </div>

            {savedLists.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20 text-center opacity-60">
                    <CalendarDays size={48} className="text-brand-muted mb-4" strokeWidth={1.5} />
                    <p className="text-[15px] font-medium text-brand-dark">Aún no has guardado listas.</p>
                    <p className="text-[13px] text-brand-muted mt-1">Genera una semana y guárdala para verla aquí.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedLists.map((item) => {
                        const date = new Date(item.date).toLocaleDateString();

                        return (
                            <div
                                key={item.id}
                                className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-brand-dark text-[15px] leading-tight">{item.name}</h3>
                                        <p className="text-[11px] text-brand-muted font-medium mt-0.5 flex items-center gap-1">
                                            <CalendarDays size={12} /> {date}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteSavedList(item.id)}
                                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Eliminar lista"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                                    {item.list.map((slot, i) => (
                                        <div key={slot.id} className={clsx(
                                            "flex-none w-20 p-2 rounded-xl text-center flex items-center justify-center",
                                            slot.meal ? "bg-brand-light" : "bg-gray-100 opacity-50 border border-dashed border-gray-300"
                                        )}>
                                            <p className="text-[10px] font-bold text-brand-dark line-clamp-2 leading-tight">
                                                {slot.customName || slot.meal?.name || '-'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2 border-t border-gray-100">
                                    <button
                                        onClick={() => handleLoad(item.id)}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-[13px] font-bold text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-colors"
                                    >
                                        Cargar lista a la ruleta <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
