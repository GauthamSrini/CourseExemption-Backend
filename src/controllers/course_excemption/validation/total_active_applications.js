const { get_query_database } = require("../../../config/database_utils");

exports.get_active_courses_count = async (req, res) => {
    try {
        const { student } = req.query;

        // Query to fetch active courses from ce_oc_registered
        const query_oc_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_oc_registered_sample
            WHERE type = '1' AND status = '1' AND student = ?
        `;
        const [oc_registered_status] = await get_query_database(query_oc_registered, [student]);
        const nptel = oc_registered_status.active_count;

        // Query to fetch active courses from ce_one_credit_registered
        const query_one_credit_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_onecredit_registered
            WHERE status = '1' AND student = ?
        `;
        const [one_credit_registered_status] = await get_query_database(query_one_credit_registered, [student]);
        const oneCredit = one_credit_registered_status.active_count;

        const query_internship_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_intern_registered
            WHERE type = '1' AND status = '1' AND student = ?
        `;
        const [internship_registered_status] = await get_query_database(query_internship_registered, [student]);
        const internship = internship_registered_status.active_count;

        const query_addon_honor_minor_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_addon_honor_minor_registered
            WHERE status = '1' AND student = ?
        `;
        const [addon_honor_minor_registered_status] = await get_query_database(query_addon_honor_minor_registered, [student]);
        const addon_honor_minor = addon_honor_minor_registered_status.active_count;

        const query_addon_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_addon_honor_minor_registered
            WHERE status = '1' AND student = ? AND mode_of_exemption = 1
        `;
        const [addon_registered_status] = await get_query_database(query_addon_registered,[student]);
        const addon = addon_registered_status.active_count;

        const query_honor_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_addon_honor_minor_registered
            WHERE status = '1' AND student = ? AND mode_of_exemption = 2
        `;
        const [honor_registered_status] = await get_query_database(query_honor_registered,[student]);
        const honor = honor_registered_status.active_count;

        const query_minor_registered = `
            SELECT COUNT(*) AS active_count
            FROM ce_addon_honor_minor_registered
            WHERE status = '1' AND student = ? AND mode_of_exemption = 3
        `;
        const [minor_registered_status] = await get_query_database(query_minor_registered,[student]);
        const minor = minor_registered_status.active_count;


        // Calculate the total active courses
        const total = nptel + oneCredit + internship + addon_honor_minor;

        // Respond with the counts
        res.status(200).json({
            nptel,
            oneCredit,
            total,
            internship,
            addon_honor_minor,
            addon,
            honor,
            minor
        });
    } catch (err) {
        console.error("Error fetching active courses count:", err);
        res.status(500).json({
            err: "Error fetching active courses count"
        });
    }
};
