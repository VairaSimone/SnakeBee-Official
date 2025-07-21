import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import api from '../services/api';
import { toast } from 'react-toastify';
import { eventTypes, sexOptions } from '../utils/constantsBreeding';
import { validateDatesSequence } from '../utils/validateDatesSequence';

const hatchlingSchema = yup.object({
  morph: yup.string().required('Morph è richiesto'),
  sex: yup.string().oneOf(['M', 'F', 'U']).required('Sesso è richiesto'),
  weight: yup.number().positive('Peso deve essere positivo').required('Peso è richiesto'),
});

const schema = yup.object({
  events: yup.array().of(
    yup.object({
      type: yup.string().oneOf(eventTypes.map(e => e.value)).required(),
      date: yup.date().typeError('Data evento obbligatoria').required('Data evento obbligatoria'),
      notes: yup.string().max(300)
    })
  ).min(1),
  hatchlings: yup.array().of(hatchlingSchema),
  notes: yup.string().max(500)
});

const BreedingEditModal = ({ breeding, show, handleClose, refresh }) => {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      events: [],
      hatchlings: [],
      notes: ''
    }
  });

  const { fields: events, append: addEvent, remove: removeEvent } = useFieldArray({ control, name: 'events' });
  const { fields: hatchlings, append: addHatchling, remove: removeHatchling } = useFieldArray({ control, name: 'hatchlings' });

  // Chiudi modale cliccando fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };
    if (show) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [show]);

  useEffect(() => {
    if (show && breeding) {
      const initialEvents = breeding.events.map(e => ({
        ...e,
        date: e.date ? new Date(e.date).toISOString().split('T')[0] : ''
      }));

      reset({
        events: initialEvents,
        hatchlings: breeding.hatchlings || [],
        notes: breeding.notes || ''
      });
    }
  }, [show, breeding]);

  const onSubmit = async (data) => {
    const seq = validateDatesSequence(data.events);
    if (!seq.valid) {
      toast.error(seq.message);
      return;
    }

    try {
      setLoading(true);
      await api.put(`/breeding/${breeding._id}`, {
        events: data.events,
        hatchlings: data.hatchlings,
        notes: data.notes
      });

      toast.success('Riproduzione aggiornata con successo');
      refresh();
      handleClose(); 
    } catch (err) {
      toast.error('Errore durante l’aggiornamento');
    } finally {
      setLoading(false);
    }
  };

  if (!show || !breeding) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div ref={modalRef} className="bg-white text-black rounded-xl p-6 w-full max-w-3xl max-h-full overflow-auto">
        <button onClick={handleClose} className="float-right text-2xl">×</button>
        <h3 className="text-2xl font-bold mb-4">Modifica Riproduzione</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Eventi */}
          <div>
            <label className="font-medium">Eventi</label>
            {events.map((field, idx) => (
              <div key={field.id} className="flex items-end gap-2 mb-2">
                <select {...register(`events.${idx}.type`)} className="bg-white text-black border p-2 rounded w-1/3">
                  {eventTypes.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                </select>

                <input
                  type="date"
                  {...register(`events.${idx}.date`)}
                  className="bg-white text-black border p-2 rounded w-1/3"
                />

                <input
                  type="text"
                  placeholder="Note"
                  {...register(`events.${idx}.notes`)}
                  className="bg-white text-black border p-2 rounded w-1/3"
                />

                <button type="button" onClick={() => removeEvent(idx)} className="text-red-600 text-xl">✕</button>
              </div>
            ))}
            <select
              onChange={e => {
                if (!e.target.value) return;
                addEvent({ type: e.target.value, date: '', notes: '' });
                e.target.value = '';
              }}
              className="bg-white text-black border p-2 rounded mt-2"
            >
              <option value="">+ Aggiungi evento</option>
              {eventTypes.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
            </select>
          </div>

          {/* Hatchlings */}
          <div>
            <label className="font-medium">Cuccioli</label>
            {hatchlings.map((f, i) => (
              <div key={f.id} className="flex items-end gap-2 mb-2">
                <input placeholder="Morph" {...register(`hatchlings.${i}.morph`)} className="border p-2 rounded" />
                <input type="number" placeholder="Peso (g)" {...register(`hatchlings.${i}.weight`)} className="border p-2 rounded" />
                <select {...register(`hatchlings.${i}.sex`)} className="border p-2 rounded">
                  <option value="">Sesso</option>
                  {sexOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button type="button" onClick={() => removeHatchling(i)} className="text-red-600 text-xl">✕</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addHatchling({ morph: '', weight: '', sex: 'U' })}
              className="text-blue-600 mt-2"
            >
              + Cucciolo
            </button>
          </div>

          {/* Note */}
          <div>
            <label>Note generali</label>
            <textarea {...register('notes')} className="bg-white text-black border p-2 rounded w-full" rows={3} />
            {errors.notes && <p className="text-red-600">{errors.notes.message}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`py-3 px-6 rounded w-full font-semibold ${isValid ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {loading ? 'Salvataggio in corso...' : 'Salva modifiche'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BreedingEditModal;
