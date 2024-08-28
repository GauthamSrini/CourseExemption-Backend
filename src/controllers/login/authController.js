const { OAuth2Client } = require('google-auth-library');
const { generateToken, generateRefreshToken } = require('../../utils/jwtUtils');
const {get_query_database } = require("../../config/database_utils");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

const googleAuth = (req, res) => {
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("CLIENT_SECRET:", process.env.CLIENT_SECRET);
console.log("REDIRECT_URI:", process.env.REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
  res.redirect(authUrl);
};

const googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    console.log('User Email:', payload.email);
    const rows = await get_query_database(
      'SELECT master_students.user_id, master_students.department, master_students.register_number, master_students.name, master_year.year, master_branch.branch, master_students.department, master_students.mentor_code FROM master_students JOIN master_branch ON master_students.department = master_branch.id JOIN master_year ON master_students.year = master_year.id WHERE master_students.email = ?', 
      [payload.email]
    );

    if (rows.length === 0) {
      console.log('No user found with this email.');
      return res.status(401).json({ message: 'User not found.' });
    }

    const user_id = rows[0].user_id;
    const { register_number, name, year, branch, mentor_code, department} = rows[0];
    
    console.log('User ID:', user_id);
    console.log('Register Number:', register_number);
    console.log('Name:', name);
    console.log('Year:', year);
    console.log('Department ID',department);
    console.log('Department:', branch);
    console.log('Mentor code:', mentor_code);

    const roles = await get_query_database('SELECT role_id FROM user_roles_mapping WHERE user_id = ?', [user_id]);
    const roleIds = roles.map(role => role.role_id);

    const placeholders = roleIds.map(() => '?').join(',');
    const resources = await get_query_database(
      `SELECT r.id, r.resource_name, r.path FROM roles_resources_mapping rm
       JOIN master_resources r ON rm.resource_id = r.id
       WHERE rm.role_id IN (${placeholders})`,
      roleIds
    );
    const userResources = resources.map(resource => ({ resource_name: resource.resource_name, path: resource.path }));

    console.log('Role IDs:', roleIds);
    console.log('User Resources:', userResources);
    const user = { email: payload.email, user_id, register_number, name, year, department: branch, departmentId : department, mentor_code, roles: roleIds, resources: userResources };
    const jwtToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('token', jwtToken, { httpOnly: true, secure: false });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

    // Redirect to a general frontend URL and manage user data on the client-side
    res.redirect('http://localhost:5173/dashboard');
  } catch (error) {
    console.error('Error processing the Google OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { googleAuth, googleCallback };