const { verifyRefreshToken } = require('../../utils/jwtUtils');
const { get_query_database } = require("../../config/database_utils");

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = await verifyRefreshToken(refreshToken);
    const newJwtToken = generateToken(decoded.user);
    res.cookie('token', newJwtToken, { httpOnly: true, secure: false });
    res.json({ token: newJwtToken });
  } catch (err) {
    console.error(`Refresh Token Error: ${err.message}`);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

const getUserData = async (req, res) => {
  res.json(req.user);
};

const getRolesAndResources = async (req, res) => {
  const user_id = req.user.user_id;

  try {
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

    res.json(userResources);
  } catch (error) {
    console.error('Error fetching roles and resources:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  refreshToken,
  getUserData,
  getRolesAndResources,
};
