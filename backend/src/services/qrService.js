const QRCode = require('qrcode');
const { pool } = require('../models/database');

class QRService {
  static async generateQR(userId, conferenceId) {
    const payload = {
      userId,
      conferenceId,
      timestamp: Date.now()
    };
    
    const qrData = JSON.stringify(payload);
    const qrImage = await QRCode.toDataURL(qrData);
    
    // Store QR in database
    const query = `
      UPDATE attendances 
      SET qr_code = $1 
      WHERE user_id = $2 AND conference_id = $3 
      RETURNING id`;
      
    await pool.query(query, [qrImage, userId, conferenceId]);
    
    return qrImage;
  }

  static async validateQR(qrCode) {
    try {
      const query = `
        SELECT a.*, c.capacity, c.current_attendance
        FROM attendances a
        JOIN conferences c ON a.conference_id = c.id
        WHERE a.qr_code = $1 AND a.attended = false`;
      
      const { rows } = await pool.query(query, [qrCode]);
      
      if (rows.length === 0) {
        return { valid: false, message: 'Invalid or already used QR code' };
      }

      const attendance = rows[0];
      
      if (attendance.current_attendance >= attendance.capacity) {
        return { valid: false, message: 'Conference is at full capacity' };
      }

      // Mark attendance and update conference count
      await pool.query(`
        BEGIN;
        UPDATE attendances SET attended = true WHERE id = $1;
        UPDATE conferences 
        SET current_attendance = current_attendance + 1 
        WHERE id = $2;
        COMMIT;
      `, [attendance.id, attendance.conference_id]);

      return { valid: true, attendance };
    } catch (error) {
      console.error('QR validation error:', error);
      return { valid: false, message: 'Error validating QR code' };
    }
  }
}

module.exports = QRService;
