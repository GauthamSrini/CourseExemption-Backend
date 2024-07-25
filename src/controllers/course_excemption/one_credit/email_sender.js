const { get_query_database, post_query_database } = require('../../../config/database_utils');
const nodemailer = require('nodemailer');

exports.sendReminderEmail = async (req, res) => {
  try {
    const { studentEmail, studentId } = req.body; // Assuming the student's email and id are provided in the request body

    // Check if email has already been sent to the student
    const checkQuery = 'SELECT status FROM ce_oc_mail_status WHERE student = ?';
    const [checkResult] = await  get_query_database(checkQuery, [studentId]);
    console.log(checkResult);
    const status = checkResult.status;
    console.log(status);

    if (status === 1) {
      // Email already sent, do not send again
      return res.status(200).json({ message: 'Email already sent to this student' });
    }
    else{
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "pragalya296@gmail.com",
        pass: "fgfz nktp vbwc dzna" // Your Gmail password
      },
      secure: true
    });

    // Define email options
    const mailOptions = {
      from: "pragalya296@gmail.com",
      to: studentEmail,
      subject: "Reminder: Complete Your Courses",
      text: "Dear student, please complete your courses as soon as possible."
    };

    // Send the email
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending reminder email:', error);
        return res.status(500).json({ error: 'Failed to send reminder email' });
      }
      else{
      // Update the status to indicate that the email has been sent
      const updateQuery = 'UPDATE ce_oc_mail_status SET status = 1 WHERE student = ?';
      await post_query_database(updateQuery, [studentId]);
      console.log('Email sent successfully');
      return res.status(200).json({ message: 'Email sent successfully' });
      }
    });
    }
  } catch (error) {
    console.error('Error sending reminder email:', error);
    res.status(500).json({ error: 'Failed in the process' });
  }
};
