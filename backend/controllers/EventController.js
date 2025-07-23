import Event from '../models/Event.js';

// GET /events/:reptileId
export const GetEvents = async (req, res) => {
  try {
    const events = await Event.find({ reptile: req.params.reptileId }).sort({ date: -1 });
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: 'Error retrieving events' });
  }
};

// POST /events
export const CreateEvent = async (req, res) => {
  try {
    const { reptileId, type, date, notes, weight } = req.body;

    const newEventData = {
      reptile: reptileId,
      type,
      date: new Date(date),
      notes,
    };

    if (type === 'weight') {
      if (!weight || isNaN(weight)) {
        return res.status(400).send({ message: 'Peso non valido per evento di tipo "weight".' });
      }
      newEventData.weight = weight;
    }

    const newEvent = new Event(newEventData);
    const saved = await newEvent.save();
    res.status(201).send(saved);
  } catch (err) {
    res.status(400).send({ message: 'Errore nella creazione dell\'evento', err });
  }
};

// DELETE /events/:eventId
export const DeleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.send({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting event' });
  }
};
