import Reptile from '../models/Reptile.js';
import Feeding from '../models/Feeding.js';
import Event from '../models/Event.js';
import Breeding from '../models/Breeding.js';
import ExcelJS from 'exceljs';

export const exportReptileData = async (req, res) => {
  try {
    const userId = req.params.userId;

    const reptiles = await Reptile.find({ user: userId }).lean();
    const reptileMap = reptiles.reduce((acc, r) => {
      acc[r._id] = {
        morph: r.morph || 'No morph',
        sex: r.sex || 'Unknown',
      };
      return acc;
    }, {});

    const reptileIds = Object.keys(reptileMap);

    const feedings = await Feeding.find({ reptile: { $in: reptileIds } }).lean();
    const events = await Event.find({ reptile: { $in: reptileIds } }).lean();
    const breedings = await Breeding.find({ user: userId })
      .populate('male', 'morph sex')
      .populate('female', 'morph sex')
      .lean();

    const workbook = new ExcelJS.Workbook();

    // 🐍 Foglio Reptiles
    const reptileSheet = workbook.addWorksheet('Reptiles');
    reptileSheet.columns = [
      { header: 'Name', key: 'name' },
      { header: 'Species', key: 'species' },
      { header: 'Morph', key: 'morph' },
      { header: 'Sex', key: 'sex' },
      { header: 'Birth Date', key: 'birthDate' }
    ];
    reptileSheet.addRows(reptiles.map(r => ({
      name: r.name || 'N/A',
      species: r.species,
      morph: r.morph || 'No morph',
      sex: r.sex || 'Unknown',
      birthDate: r.birthDate ? new Date(r.birthDate).toLocaleDateString() : 'N/A'
    })));

    // 🍗 Feedings
    const feedingSheet = workbook.addWorksheet('Feedings');
    feedingSheet.columns = [
      { header: 'Reptile (Morph - Sex)', key: 'reptile' },
      { header: 'Date', key: 'date' },
      { header: 'Food Type', key: 'foodType' },
      { header: 'Quantity', key: 'quantity' },
      { header: 'Next Feeding', key: 'nextFeedingDate' }
    ];
    feedingSheet.addRows(feedings.map(f => ({
      reptile: `${reptileMap[f.reptile]?.morph} - ${reptileMap[f.reptile]?.sex}`,
      date: f.date ? new Date(f.date).toLocaleDateString() : '',
      foodType: f.foodType,
      quantity: f.quantity,
      nextFeedingDate: f.nextFeedingDate ? new Date(f.nextFeedingDate).toLocaleDateString() : ''
    })));

    // 📅 Events
    const eventSheet = workbook.addWorksheet('Events');
    eventSheet.columns = [
      { header: 'Reptile (Morph - Sex)', key: 'reptile' },
      { header: 'Type', key: 'type' },
      { header: 'Date', key: 'date' },
      { header: 'Notes', key: 'notes' }
    ];
    eventSheet.addRows(events.map(e => ({
      reptile: `${reptileMap[e.reptile]?.morph} - ${reptileMap[e.reptile]?.sex}`,
      type: e.type,
      date: e.date ? new Date(e.date).toLocaleDateString() : '',
      notes: e.notes || ''
    })));

    // 🐣 Breedings
    const breedingSheet = workbook.addWorksheet('Breedings');
    breedingSheet.columns = [
      { header: 'Season Year', key: 'seasonYear' },
      { header: 'Male (Morph - Sex)', key: 'male' },
      { header: 'Female (Morph - Sex)', key: 'female' },
      { header: 'Pairing Date', key: 'pairingDate' },
      { header: 'Outcome', key: 'outcome' },
      { header: 'Hatchlings', key: 'hatchlings' }
    ];
    breedingSheet.addRows(breedings.map(b => ({
      seasonYear: b.seasonYear,
      male: `${b.male?.morph || 'No morph'} - ${b.male?.sex || 'Unknown'}`,
      female: `${b.female?.morph || 'No morph'} - ${b.female?.sex || 'Unknown'}`,
      pairingDate: b.pairingDate ? new Date(b.pairingDate).toLocaleDateString() : '',
      outcome: b.outcome,
      hatchlings: b.hatchlings?.length || 0
    })));

    // ✨ Invio del file Excel come risposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reptile_data.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Errore esportazione Excel:', err);
    res.status(500).send({ message: 'Errore durante esportazione' });
  }
};
