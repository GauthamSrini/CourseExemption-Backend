const express = require("express")
const available = require("../../controllers/course_excemption/available")
const oc_course_list = require("../../controllers/course_excemption/online_course/courselist")
const oc_platform = require("../../controllers/course_excemption/online_course/platform")
const oc_registered_details = require("../../controllers/course_excemption/online_course/registered")
const oc_completed_courses = require("../../controllers/course_excemption/one_credit/completed_course")
// const pdf_uploader_middleware = require("../../middleware/pdf_uploader_middleware");
const reminder_email = require("../../controllers/course_excemption/one_credit/email_sender");
const excp_storing = require("../../controllers/course_excemption/one_credit/storing_excemption");
const one_credit_exp = require("../../controllers/course_excemption/one_credit/one_credit_excemption");
const oc_clearing = require("../../controllers/course_excemption/one_credit/clearing_one_credit");
const online_course_apply = require("../../controllers/course_excemption/online_course/apply_online_course")
const approved_status = require("../../controllers/course_excemption/validation/approved_status")
const online_faculty_approval = require("../../controllers/course_excemption/online_course/faculty_approval")
const online_to_approve = require("../../controllers/course_excemption/online_course/to_approve_student")
const online_to_reject = require("../../controllers/course_excemption/online_course/to_reject_student");
const online_exemption_validation = require("../../controllers/course_excemption/online_course/exemption_validation");
const ce_graph_data = require("../../controllers/course_excemption/graphData")
const SearchCourses = require("../../controllers/course_excemption/online_course/searchingCourseList")
const EditCourses = require("../../controllers/course_excemption/online_course/edit_online_course")
const DeleteCourses = require("../../controllers/course_excemption/online_course/delete_online_course")
const SingleUpload = require("../../controllers/course_excemption/online_course/upload_single_online_course")
const ExcelUpload = require("../../controllers/course_excemption/online_course/upload_excel_online_course")
const ExcelUploadOneCredit = require("../../controllers/course_excemption/one_credit/one_credit_excel_upload")
const OneCreditApprovalMembers = require("../../controllers/course_excemption/one_credit/approval_members")
const RollNumbers = require("../../controllers/course_excemption/rollnumbers")
const OneCreditSingleUpload = require("../../controllers/course_excemption/one_credit/one_credit_single_upload")
const SearchingOneCredit = require("../../controllers/course_excemption/one_credit/seraching_course_list_one_credit")
const DeletingOnecredit = require("../../controllers/course_excemption/one_credit/deleting_onecredit_completion")
const AllActiveApllications = require("../../controllers/course_excemption/validation/total_active_applications")
const OnlineCourseApprovalMembers = require("../../controllers/course_excemption/online_course/approval_members")
const AvailableElectives = require("../../controllers/course_excemption/electives")
const InternshipApply = require("../../controllers/course_excemption/internship/internship_apply")
const InternShipCompanyApply = require("../../controllers/course_excemption/internship/internship_single_upload")
const FetchingAllIndustries = require("../../controllers/course_excemption/internship/getting_all_industries")
const GetRegisteredIntern = require("../../controllers/course_excemption/internship/registered")
const InternApprovalMembers = require("../../controllers/course_excemption/internship/approval_members")
const ModeOfExemption = require("../../controllers/course_excemption/addon_honor_minor/available_mode_of_exemption")
const HonorMinorSingleUpload = require("../../controllers/course_excemption/addon_honor_minor/honorMinor_single_upload")
const HonorMinorExcelUpload = require("../../controllers/course_excemption/addon_honor_minor/honorMinor_excel_upload")
const AddOnExcelUpload = require("../../controllers/course_excemption/addon_honor_minor/AddOn_excel_upload")
const AddOnSingleUpload = require("../../controllers/course_excemption/addon_honor_minor/AddOn_single_upload")
const ListOfStudentMappings = require("../../controllers/course_excemption/addon_honor_minor/searching_course_student_mappings")
const DeleteAddOnHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/Deleting_addon_honor_minor")
const CompletedAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/completed_applied_courses")
const ApplyAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/addon_honor_minor_apply")
const AddonHmApprovalMembers = require("../../controllers/course_excemption/addon_honor_minor/approval_members")
const AvailableAcademicYears = require("../../controllers/course_excemption/available_academic_year")
const AvailableSemester = require("../../controllers/course_excemption/available_semester")
const InternExcelUpload = require("../../controllers/course_excemption/internship/internship_excel_upload")
const InternCompanySearch = require("../../controllers/course_excemption/internship/searching_companies")
const InternCompanyEdit = require("../../controllers/course_excemption/internship/edit_intern_companies")
const InternCompanyDelete = require("../../controllers/course_excemption/internship/deleting_intern_company")

//middleware for storing the excel sheet
const upload = require("../../middleware/upload");
const uploadOneCredit = require("../../middleware/uploadOneCredit")
const uploadHonorMinor = require("../../middleware/upload_honor_minor")
const uploadAddOn = require("../../middleware/upload_addon")
const uploadIntern = require("../../middleware/upload_intern_company")


const router = express.Router()

router.get("/", available.get_available)
router.get("/oc/courselist", oc_course_list.get_courselist)
router.get("/oc/platform", oc_platform.get_platform)//// involved courselist
router.get("/oc/platform/excemption", oc_platform.get_platform_excemption);
router.get("/oc/registered", oc_registered_details.get_registered)
router.get("/oc/completedCourses",oc_completed_courses.get_completed)
router.post("/oc/StoringExcemption",excp_storing.post_Excemption)
router.get("/oc/oneCreditExp",one_credit_exp.get_one_credit_excemption)
router.post("/oc/clearance",oc_clearing.post_clearance_one_credit);
router.get("/oc/SearchCourseList",SearchCourses.get_CourseListEdit);//// involved courselist
router.post("/oc/sendReminderEmail",reminder_email.sendReminderEmail );
router.use("/oc/onlineApply",online_course_apply)
router.get("/oc/facultyApprovals",online_faculty_approval.get_faculty_approvals);
router.post("/oc/toApprove",online_to_approve.post_approve_student);
router.post("/oc/toReject",online_to_reject.post_reject_student)
router.post("/oc/EditCourseList",EditCourses.edit_online_course)//// involved courselist
router.post("/oc/DeleteCourseList",DeleteCourses.delete_online_course)//// involved courselist
router.get("/oc/courseExpValidation",online_exemption_validation.get_validation_status)
router.get("/oc/graphData",ce_graph_data.get_graph_data)
router.post("/oc/SingleOnlineUpload",SingleUpload.upload_single_online_course)
router.post("/oc/UploadExcel",upload.single('file'),ExcelUpload.processExcelFile)
router.post("/oc/UploadExcelOneCredit",uploadOneCredit.single('file'),ExcelUploadOneCredit.processExcelFileOneCredit)
router.get("/oc/OneCreditApprovalMembers",OneCreditApprovalMembers.get_approval_members)
router.get("/availableRollNumbers",RollNumbers.get_available_rollnumbers)
router.post("/oc/OneCreditSingleUpload",OneCreditSingleUpload.post_single_one_credit)
router.get("/oc/SearchingOneCreditCourse",SearchingOneCredit.get_CourseList_one_credit)
router.post("/oc/DeletingOnecreditCompletion",DeletingOnecredit.delete_onecredit_course)
router.get("/oc/AllActiveApplications",AllActiveApllications.get_active_courses_count)
router.get("/oc/ApprovedStatusAll",approved_status.get_approved_status)
router.get("/oc/OnlineCourseApprovalMembers",OnlineCourseApprovalMembers.get_approval_members)
router.get("/AvailableElectives",AvailableElectives.get_available_elective)
router.get("/AvailableAcademicYears",AvailableAcademicYears.get_available_academic_year)
router.get("/AvailableSemester",AvailableSemester.get_academic_semester)
router.use("/in/InternApply",InternshipApply)
router.get("/in/AllIndustries",FetchingAllIndustries.get_all_industries)
router.get("/in/Registered",GetRegisteredIntern.get_registered_intern)
router.get("/in/InternApprovalMembers",InternApprovalMembers.get_approval_members)
router.post("/in/InternShipCompanyApply",InternShipCompanyApply.add_company)
router.get("/AddHM/AvailableModeOfExemption",ModeOfExemption.get_mode_of_exemption)
router.post("/AddHm/HonorMinorSingleUpload",HonorMinorSingleUpload.honor_minor_single_upload)
router.post("/AddHm/HonorMinorExcelUpload",uploadHonorMinor.single('file'),HonorMinorExcelUpload.processExcelFileHonorMinor)
router.post("/AddHm/AddOnExcelUpload",uploadAddOn.single('file'),AddOnExcelUpload.processExcelFileAddOn)
router.post("/AddHm/AddOnSingleUpload",AddOnSingleUpload.add_on_single_upload)
router.get("/AddHm/ListOfStudentMappings",ListOfStudentMappings.get_course_student_mappings)
router.post("/AddHm/DeleteAddOnHonorMinor",DeleteAddOnHonorMinor.delete_addon_honor_minor)
router.get("/AddHm/CompletedAddonHonorMinor",CompletedAddonHonorMinor.get_completed_addon_honor_minor)
router.post("/AddHm/ApplyAddonHonorMinor",ApplyAddonHonorMinor.apply_addon_honor_minor)
router.get("/AddHm/AddonHmApprovalMembers",AddonHmApprovalMembers.get_approval_members)
router.post("/in/InternExcelUpload",uploadIntern.single('file'),InternExcelUpload.processExcelFileIntern)
router.get("/in/InternCompanySearch",InternCompanySearch.get_company_list)
router.post("/in/InternCompanyEdit",InternCompanyEdit.edit_company_details)
router.post("/in/InternCompanyDelete",InternCompanyDelete.delete_company)


// router.post("/oc/registered", pdf_uploader_middleware ,oc_registered_details.post_registered)

module.exports = router;