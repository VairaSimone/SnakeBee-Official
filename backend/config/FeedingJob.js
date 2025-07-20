import cron from 'node-cron';
import Feeding from '../models/Feeding.js';
import Notification from '../models/Notification.js';
import Redis from 'ioredis';
import Redlock from 'redlock';
import FailedEmail from '../models/FailedEmail.js'; // in alto
import { transporter } from '../config/mailer.config.js';


const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const redlock = new Redlock([redis], {
  retryCount: 3,
  retryDelay: 200, // ms
});

// Function to normalize the date to midnight
const normalizeDate = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0); // Set the hours to midnight in UTC 
  return normalizedDate;
};

cron.schedule('0 0 * * *', async () => {
      try {
    const lock = await redlock.acquire(['locks:feedingJob'], 5 * 60 * 1000); // 5 min TTL


    console.log('JOB - Feeding Job');

    try {

      // Get the start and end of today in UTC
      const todayStart = normalizeDate(new Date());
      const todayEnd = new Date(todayStart);
      todayEnd.setUTCHours(23, 59, 59, 999);   // Set the hours to midnight in UTC 

      // Find all the feedings that need to be fed today
      const feedings = await Feeding.find({
        nextFeedingDate: {
          $lte: todayEnd,
        },
      }).populate({
        path: 'reptile',
        populate: {
          path: 'user',
          select: 'email name receiveFeedingEmails'
        }
      });

      // Group feedings by user
      const notificationsByUser = {};

      for (const feeding of feedings) {
        const reptile = feeding.reptile;
        const user = reptile ? reptile.user : null;
        if (!user || !user.email) continue;
if (user.receiveFeedingEmails === false) {
  console.log(`Utente ${user.email} ha disattivato le notifiche alimentazione.`);
  continue;
}
        if (!reptile || !user) {
          console.warn(`Missing reptile or user for feeding with ID ${feeding._id}`);
          continue;
        }

        const userId = user._id;

        if (!notificationsByUser[userId]) {
          notificationsByUser[userId] = {
            user,
            reptiles: [],
          };
        }
        notificationsByUser[userId].reptiles.push({
          name: reptile.name,
          reptileId: reptile._id,
        });
      }

      // Create a notification for each user and send summary emails
      for (const userId in notificationsByUser) {
        const { reptiles, user } = notificationsByUser[userId];
        let emailsSent = 0;
        let emailsFailed = 0;

        const reptileList = reptiles.map((r) => r.name).join(', ');

        if (!user.email) {
          console.error(`Errore: L'utente con ID ${user._id} non ha un'email.`);
          continue;
        }
let mailOptions;
        try {
          // Verifica se esiste già una notifica identica per oggi
          const existingNotification = await Notification.findOne({
            reptile: { $all: reptiles.map((r) => r.reptileId) },
            user: userId,
            type: 'feeding',
            date: {
              $gte: new Date().setHours(0, 0, 0, 0),
              $lt: new Date().setHours(23, 59, 59, 999),
            },
          });

          //if (existingNotification) {
            //console.log(`Notifica già esistente per l'utente ${user.email}, non invio duplicato.`);
            //continue;
          //}

          // Crea la notifica (status iniziale "pending")
          const notification = new Notification({
            user: user._id,
            reptile: reptiles.map((r) => r.reptileId),
            type: 'feeding',
            message: `I tuoi rettili ${reptileList} devono essere alimentati oggi.`,
            date: todayStart,
            status: 'pending',
          });

          await notification.save();

          // Configura invio email
          // Prepara il payload
           mailOptions = {
            from: `"SnakeBee" <noreply@snakebee.it>`,
            to: user.email,
            subject: 'Notifica di alimentazione rettili',
            text: `Ciao ${user.name},\n\nI tuoi rettili ${reptileList} devono essere alimentati oggi.\n\nCordiali saluti,\nIl Team`,
            html: `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2c3e50;">Ciao ${user.name},</h2>
      <p>I tuoi rettili <strong>${reptileList}</strong> devono essere alimentati oggi.</p>
      <p style="margin-top: 20px;">Cordiali saluti,<br>Il Team SnakeBee</p>
    </div>
  `
          };


          // Invia l’email
          emailsSent++;
          await transporter.sendMail(mailOptions);

          // Aggiorna la notifica a "sent"
          notification.status = 'sent';
          await notification.save();
          console.log(`Email inviata a ${user.email}`);

        } catch (err) {
          emailsFailed++;
          console.error(`Errore nell'invio email a ${user.email}:`, err);

          await new FailedEmail({
            to: user.email,
            subject: mailOptions.subject,
            text: mailOptions.text,
            html: mailOptions.html,
            error: err.message
          }).save();

        }


        console.log(`JOB COMPLETATO: Email inviate: ${emailsSent}, fallite: ${emailsFailed}`);

      }

    } catch (err) {
      console.error('Error inside Feeding Job:', err);
    } finally {
      await lock.release();
    }
  } catch (err) {
    console.warn('Feeding Job skipped: lock not acquired');
  }
});
