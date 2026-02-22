import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Edit3 } from 'lucide-react';
import clsx from 'clsx';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function MealCard({ slot, index, onEdit }) {
    const dayName = DAYS[index];
    const displayName = slot.customName || slot.meal?.name || 'Vacío (Presiona para generar)';

    return (
        <Draggable draggableId={slot.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={clsx(
                        'flex items-center p-3 mb-3 bg-white rounded-2xl border transition-shadow cursor-pointer',
                        snapshot.isDragging ? 'shadow-lg border-brand-primary' : 'shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border-gray-100 hover:border-brand-secondary/30',
                        !slot.meal && 'border-dashed border-gray-300'
                    )}
                    onClick={() => onEdit(slot)}
                >
                    <div {...provided.dragHandleProps} className="text-gray-300 hover:text-gray-500 p-2 py-3 active:text-brand-primary transition-colors cursor-grab active:cursor-grabbing mr-1">
                        <GripVertical size={20} />
                    </div>

                    <div className="flex-1 pr-2">
                        <p className="text-[10px] font-bold text-brand-primary mb-0.5 uppercase tracking-wider">{dayName}</p>
                        <p className={clsx("text-[15px] font-medium leading-tight", !slot.meal ? "text-gray-400 italic" : "text-brand-dark")}>
                            {displayName}
                        </p>
                        {slot.note && <p className="text-[11px] text-brand-muted mt-1 leading-tight flex items-start gap-1"><span className="opacity-70">Nota:</span> {slot.note}</p>}
                    </div>

                    <button
                        type="button"
                        className="p-2.5 text-gray-300 hover:text-brand-secondary hover:bg-brand-light transition-all rounded-xl"
                    >
                        <Edit3 size={18} />
                    </button>
                </div>
            )}
        </Draggable>
    );
}
