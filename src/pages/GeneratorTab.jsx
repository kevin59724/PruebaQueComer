import { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAppStore } from '../store/useAppStore';
import MealCard from '../components/MealCard';
import { Dices, Save, ArrowLeft } from 'lucide-react';

export default function GeneratorTab() {
    const { currentWeekList, generateWeek, reorderWeekList, updateDaySlot, regenerateSlot, saveCurrentList } = useAppStore();
    const [editingSlot, setEditingSlot] = useState(null);
    const [saveName, setSaveName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        reorderWeekList(result.source.index, result.destination.index);
    };

    const hasMeals = currentWeekList.some(s => s?.meal);
    const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    return (
        <div className="p-5 pt-8 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-brand-dark flex items-center gap-2">
                        QuéComer!
                    </h1>
                    <p className="text-brand-muted text-[13px] font-medium mt-0.5">Qué cocinamos esta semana</p>
                </div>
                <button
                    onClick={generateWeek}
                    className="tour-btn-generar bg-brand-primary hover:bg-[#d0694e] text-white rounded-2xl py-2.5 px-4 shadow-[0_4px_14px_-4px_#e07a5f] transition-all active:scale-95 flex items-center gap-2 font-bold relative z-0"
                >
                    <Dices size={20} className="drop-shadow-sm" /> <span className="text-sm">Generar</span>
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="week-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="tour-card-meal min-h-[350px] relative z-0"
                        >
                            {currentWeekList.map((slot, index) => {
                                const safeSlot = slot || { id: `empty-${index}`, dayIndex: index, meal: null, note: '', customName: '' };
                                return <MealCard key={safeSlot.id} slot={safeSlot} index={index} onEdit={setEditingSlot} />;
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="mt-4 flex flex-col gap-2 pb-6 tour-btn-guardar relative z-0">
                {isSaving ? (
                    <div className="flex gap-2 p-1.5 bg-white rounded-2xl shadow-[0_2px_15px_-4px_rgba(0,0,0,0.1)] border border-gray-100">
                        <input
                            value={saveName}
                            onChange={e => setSaveName(e.target.value)}
                            placeholder="Ej: Semana del 12..."
                            className="flex-1 bg-transparent text-sm outline-none px-3 font-medium placeholder:font-normal placeholder:text-gray-400"
                            autoFocus
                        />
                        <button onClick={() => {
                            if (saveName) {
                                saveCurrentList(saveName);
                                setSaveName('');
                                setIsSaving(false);
                            }
                        }} className="bg-brand-secondary text-white font-bold text-xs px-4 py-2 rounded-xl active:scale-95 transition-transform">Guardar</button>
                        <button onClick={() => setIsSaving(false)} className="text-gray-400 font-bold text-xs px-3 hover:text-gray-600 transition-colors">✕</button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsSaving(true)}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white text-brand-dark font-bold shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gray-200 transition-all text-[13px]"
                    >
                        <Save size={18} className="text-brand-secondary" />
                        Guardar menú semanal
                    </button>
                )}
            </div>

            {/* Edit Modal Custom */}
            {editingSlot && (
                <div className="fixed inset-0 z-[100] bg-[#2a363b]/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 pb-safe shadow-2xl relative animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-300">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-extrabold text-brand-dark">Editar comida</h2>
                            <button onClick={() => setEditingSlot(null)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full">
                                <ArrowLeft size={20} className="rotate-[-90deg] sm:rotate-0" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="bg-brand-light p-4 rounded-2xl">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1.5 block">
                                    {DAYS[currentWeekList.findIndex(s => s.id === editingSlot.id)]} - Sugerencia de ruleta
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="flex-1 text-[15px] font-bold text-brand-dark leading-tight">
                                        {editingSlot.meal?.name || <span className="text-gray-400 italic font-normal">Sin asignar</span>}
                                    </span>
                                    <button
                                        onClick={() => {
                                            regenerateSlot(editingSlot.id);
                                            // update local editing slot immediately for UI snappiness
                                            setEditingSlot(useAppStore.getState().currentWeekList.find(s => s.id === editingSlot.id));
                                        }}
                                        className="p-3 bg-brand-primary text-white rounded-xl shadow-[0_2px_10px_-4px_#e07a5f] active:scale-90 transition-all"
                                        title="Aleatorio solo para este día"
                                    >
                                        <Dices size={20} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block pl-1">Nombre personalizado</label>
                                <input
                                    type="text"
                                    value={editingSlot.customName}
                                    onChange={(e) => {
                                        updateDaySlot(editingSlot.id, { customName: e.target.value });
                                        setEditingSlot(prev => ({ ...prev, customName: e.target.value }));
                                    }}
                                    placeholder="Ej: Pedir pizza, Salida familiar..."
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-[14px] font-medium text-brand-dark focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block pl-1">Notas u observaciones</label>
                                <textarea
                                    value={editingSlot.note}
                                    onChange={(e) => {
                                        updateDaySlot(editingSlot.id, { note: e.target.value });
                                        setEditingSlot(prev => ({ ...prev, note: e.target.value }));
                                    }}
                                    placeholder="Ej: Comprar ingredientes faltantes..."
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-[14px] text-brand-dark focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all resize-none h-24 shadow-sm"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setEditingSlot(null)}
                            className="w-full mt-8 py-3.5 bg-brand-dark text-white font-bold rounded-2xl shadow-lg hover:bg-gray-800 transition-colors tracking-wide text-[15px]"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
