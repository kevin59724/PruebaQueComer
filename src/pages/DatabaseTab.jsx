import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { categories } from '../data/meals';
import { Search, Plus, Eye, EyeOff, Save, ArrowLeft, ChevronRight, UtensilsCrossed } from 'lucide-react';
import clsx from 'clsx';

export default function DatabaseTab() {
    const { meals, toggleMealStatus, addMeal } = useAppStore();
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    // New Meal Form
    const [newName, setNewName] = useState('');
    const [newCat, setNewCat] = useState(categories[0]);

    // Group meals by category, filtering by search
    const filteredMeals = useMemo(() => {
        return meals.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    }, [meals, search]);

    const grouped = useMemo(() => {
        const map = {};
        categories.forEach(c => map[c] = []);
        filteredMeals.forEach(m => {
            if (map[m.category]) map[m.category].push(m);
            else {
                if (!map['Otros']) map['Otros'] = [];
                map['Otros'].push(m);
            }
        });
        return map;
    }, [filteredMeals]);

    const handleAdd = () => {
        if (newName.trim()) {
            addMeal({ name: newName.trim(), category: newCat });
            setNewName('');
            setShowAddModal(false);
            // Si agregamos desde una categoría, volver a esa categoría
            if (!activeCategory || activeCategory !== newCat) {
                setActiveCategory(newCat);
            }
        }
    };

    return (
        <div className="p-5 pt-8 min-h-full pb-24">
            {/* Header */}
            {!activeCategory ? (
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-extrabold text-brand-dark flex items-center gap-2">Base de Comidas</h1>
                        <p className="text-brand-muted text-[13px] font-medium mt-0.5">Categorías disponibles ({meals.length} platos)</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-brand-primary text-white p-2.5 rounded-full shadow-[0_4px_14px_-4px_#e07a5f] hover:bg-[#d0694e] transition-all active:scale-95"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className="p-2 bg-gray-100 text-brand-dark hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-brand-dark flex items-center gap-2">{activeCategory}</h1>
                            <p className="text-brand-muted text-[12px] font-medium mt-0.5">{grouped[activeCategory]?.length || 0} opciones</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setNewCat(activeCategory);
                            setShowAddModal(true);
                        }}
                        className="p-2.5 bg-brand-light text-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-all active:scale-95 shadow-sm border border-brand-primary/20"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            )}

            {/* Global Search */}
            <div className="relative mb-6 sticky top-4 z-10 shadow-sm rounded-2xl">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={activeCategory ? `Buscar en ${activeCategory}...` : "Buscar comida en general..."}
                    className="w-full bg-white/95 backdrop-blur-md pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 placeholder:text-gray-400 text-[14px] font-medium text-brand-dark focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 shadow-sm outline-none transition-all"
                />
            </div>

            {/* Content Area */}
            <div className="space-y-4">
                {!activeCategory ? (
                    // View: Category Cards
                    <>
                        {Object.keys(grouped).filter(c => grouped[c].length > 0 || search === '').map(cat => {
                            const allEnabled = grouped[cat].length > 0 && grouped[cat].every(m => m.enabled);
                            const someEnabled = grouped[cat].some(m => m.enabled);

                            return (
                                <div
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-brand-secondary/40 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                                            <UtensilsCrossed size={20} className="group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h2 className="text-[15px] font-bold text-brand-dark leading-tight">{cat}</h2>
                                            <p className="text-[12px] text-brand-muted mt-0.5">{grouped[cat].length} platos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                useAppStore.getState().toggleCategoryStatus(cat, !allEnabled);
                                            }}
                                            className={clsx(
                                                "p-2 rounded-xl transition-colors",
                                                someEnabled ? "text-brand-primary hover:bg-brand-light" : "text-gray-400 hover:bg-gray-200"
                                            )}
                                            title={allEnabled ? "Apagar toda la categoría" : "Encender toda la categoría"}
                                        >
                                            {someEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-brand-primary transition-colors" />
                                    </div>
                                </div>
                            );
                        })}
                        {Object.values(grouped).flat().length === 0 && search !== '' && (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-[15px] font-medium text-brand-dark">No se encontraron categorías.</p>
                            </div>
                        )}
                    </>
                ) : (
                    // View: Specific List
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* El botón global ahora se encuentra en la vista de tarjetas principales */}

                        {grouped[activeCategory]?.map(meal => (
                            <div
                                key={meal.id}
                                className={clsx(
                                    "flex items-center justify-between p-3.5 rounded-2xl bg-white border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all",
                                    meal.enabled ? "border-gray-100" : "border-gray-200 opacity-50 grayscale bg-gray-50"
                                )}
                            >
                                <span className={clsx("text-[14px] font-medium leading-tight", !meal.enabled && "line-through text-gray-400")}>
                                    {meal.name}
                                </span>
                                <button
                                    onClick={() => toggleMealStatus(meal.id)}
                                    className={clsx(
                                        "p-2 rounded-xl transition-colors",
                                        meal.enabled ? "text-brand-primary hover:bg-brand-light" : "text-gray-400 hover:bg-gray-200"
                                    )}
                                    title={meal.enabled ? "Desactivar de ruleta" : "Activar para ruleta"}
                                >
                                    {meal.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                        ))}
                        {grouped[activeCategory]?.length === 0 && (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-[14px] font-medium text-brand-dark">No hay platos en esta búsqueda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-[#2a363b]/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 pb-safe shadow-2xl relative animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 duration-300">
                        <h2 className="text-xl font-extrabold text-brand-dark mb-5">Agregar Comida</h2>

                        <div className="space-y-5">
                            <div>
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block pl-1">Nombre</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                    placeholder="Ej: Ají de Pollo..."
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-[14px] font-medium text-brand-dark focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all placeholder:font-normal placeholder:text-gray-300 shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block pl-1">Categoría</label>
                                <div className="relative">
                                    <select
                                        value={newCat}
                                        onChange={(e) => setNewCat(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-[14px] font-medium text-brand-dark focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all appearance-none shadow-sm"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 py-3.5 bg-gray-100 text-gray-500 font-bold rounded-2xl active:scale-95 transition-all text-[14px] hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAdd}
                                className="flex-1 py-3.5 bg-brand-primary text-white font-bold rounded-2xl shadow-[0_4px_14px_-4px_#e07a5f] hover:bg-[#d0694e] active:scale-95 transition-all flex items-center justify-center gap-2 text-[14px]"
                            >
                                <Save size={18} /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
