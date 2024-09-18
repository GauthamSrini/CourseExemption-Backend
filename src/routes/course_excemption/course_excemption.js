const express = require("express")
const {get_available} = require("../../controllers/course_excemption/available")
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
const online_course_apply_special = require("../../controllers/course_excemption/online_course/apply_online_course_special_case")
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
const AvailableBranch = require("../../controllers/course_excemption/available_branches")
const TotalElectives = require("../../controllers/course_excemption/totalElectives")
const FilterOnlineReport = require("../../controllers/course_excemption/reports/filtered_online")
const FilterOneCreditReport = require("../../controllers/course_excemption/reports/filtered_one_credit")
const FilterInternReport = require("../../controllers/course_excemption/reports/filtered_internship")
const FilterAddonReport = require("../../controllers/course_excemption/reports/filtered_addon")
const FilterHonorReport = require("../../controllers/course_excemption/reports/filtered_honor")
const FilterMinorReport = require("../../controllers/course_excemption/reports/filtered_minor")
const ApprovedOnlineCourse = require("../../controllers/course_excemption/online_course/approved_applications")
const RejectedOnlineCourse = require("../../controllers/course_excemption/online_course/rejected_applications")
const RevokeOnlineCourse = require("../../controllers/course_excemption/online_course/revoke_online_course")
const ActiveApplicationOnlineForValidation = require("../../controllers/course_excemption/online_course/active_application_of_student_with_course")
const PendingInternApplications = require("../../controllers/course_excemption/internship/internship_pendings")
const ToApproveInternship = require("../../controllers/course_excemption/internship/to_approve_intern")
const ToRejectInternship = require("../../controllers/course_excemption/internship/to_reject_intern")
const ApprovedInternship = require("../../controllers/course_excemption/internship/approved_interns")
const RevokingIntern = require("../../controllers/course_excemption/internship/revoking_intern_application")
const RejectedInternship = require("../../controllers/course_excemption/internship/rejected_interns")
const PendingOneCredit = require("../../controllers/course_excemption/one_credit/pending_one_credit")
const ToApproveOneCredit = require("../../controllers/course_excemption/one_credit/to_approve_one_credit")
const ToRejectOneCredit = require("../../controllers/course_excemption/one_credit/to_reject_one_credit")
const ApprovedOneCredit = require("../../controllers/course_excemption/one_credit/approved_one_credit")
const RejectedOneCredit = require("../../controllers/course_excemption/one_credit/rejected_one_credit")
const RevokingOneCredit = require("../../controllers/course_excemption/one_credit/revoking_one_credit")
const PendingAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/pending_applications_addHm")
const ApprovedAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/approved_applications_addHm")
const RejectedAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/rejected_applications_addHm")
const ToApproveAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/to_approve_addHm")
const ToRejectAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/to_reject_addHm")
const RevokingAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/revoking_addHm")
const ClearingAddonHonorMinor = require("../../controllers/course_excemption/addon_honor_minor/clearing_applications_addHm")
const AddHmActiveCoursesForValidation = require("../../controllers/course_excemption/addon_honor_minor/addHm_active_applications_for_validation")
const InternTrackerApply  = require("../../controllers/course_excemption/internship/intern_tracker_apply")
const RegisteredInterntrackers = require("../../controllers/course_excemption/internship/registered_trackers")
const InternTrackerApprovals = require("../../controllers/course_excemption/internship/intern_tracker_approvals")

//middleware for storing the excel sheet
const upload = require("../../middleware/upload");
const uploadOneCredit = require("../../middleware/uploadOneCredit")
const uploadHonorMinor = require("../../middleware/upload_honor_minor")
const uploadAddOn = require("../../middleware/upload_addon")
const uploadIntern = require("../../middleware/upload_intern_company")

const ensureAuthenticated = require("../../middleware/authMiddleware")

const router = express.Router()


router.get("/",ensureAuthenticated, get_available) // student
router.get("/oc/courselist",ensureAuthenticated, oc_course_list.get_courselist) // student ----------------- need to modify as it contains ce_oc_registered --------- (Done...)
router.get("/oc/platform",ensureAuthenticated, oc_platform.get_platform)// student
router.get("/oc/platform/excemption",ensureAuthenticated, oc_platform.get_platform_excemption);// student
router.get("/oc/registered",ensureAuthenticated, oc_registered_details.get_registered)// student --------------- need to modify as it contains ce_oc_registered ---------- (Done...)
router.get("/oc/completedCourses",ensureAuthenticated,oc_completed_courses.get_completed)// student
router.post("/oc/StoringExcemption",ensureAuthenticated,excp_storing.post_Excemption)// student
router.get("/oc/oneCreditExp",ensureAuthenticated,one_credit_exp.get_one_credit_excemption)// student
router.post("/oc/clearance",ensureAuthenticated,oc_clearing.post_clearance_one_credit); // office academics, head Academics, COE
router.get("/oc/SearchCourseList",ensureAuthenticated,SearchCourses.get_CourseListEdit);// Autonomy Affairs
router.post("/oc/sendReminderEmail",ensureAuthenticated,reminder_email.sendReminderEmail); //----------------------- deprecated
router.use("/oc/onlineApply",ensureAuthenticated,online_course_apply) // student -------- need to modify as it contains ce_oc_registered --------------- (Done..)
router.use("/oc/onlineApply/special",ensureAuthenticated,online_course_apply_special)// student
router.get("/oc/facultyApprovals",ensureAuthenticated,online_faculty_approval.get_faculty_approvals); // HOD, Autonomy Affairs, COE ------------ need to modify as it contains ce_oc_registered -------------- (Done...)
router.post("/oc/toApprove",ensureAuthenticated,online_to_approve.post_approve_student); // HOD, Autonomy Affairs, COE  ------ need to modify as it contains ce_oc_registered ------------- (Done....)
router.post("/oc/toReject",ensureAuthenticated,online_to_reject.post_reject_student) // HOD, Autonomy Affairs, COE  ------ need to modify as it contains ce_oc_registered ------ (Done....)
router.post("/oc/EditCourseList",ensureAuthenticated,EditCourses.edit_online_course) // Autonomy Affairs
router.post("/oc/DeleteCourseList",ensureAuthenticated,DeleteCourses.delete_online_course)// Autonomy Affairs -------------- need to modify as it contains ce_oc_registered ----- (Done....)
router.get("/oc/courseExpValidation",ensureAuthenticated,online_exemption_validation.get_validation_status)// student
router.get("/oc/graphData",ensureAuthenticated,ce_graph_data.get_graph_data) //-------------------------------------------------deprecated
router.post("/oc/SingleOnlineUpload",ensureAuthenticated,SingleUpload.upload_single_online_course)// Autonomy Affairs
router.post("/oc/UploadExcel",ensureAuthenticated,upload.single('file'),ExcelUpload.processExcelFile)// Autonomy Affairs
router.post("/oc/UploadExcelOneCredit",ensureAuthenticated,uploadOneCredit.single('file'),ExcelUploadOneCredit.processExcelFileOneCredit)// COE
router.get("/oc/OneCreditApprovalMembers",ensureAuthenticated,OneCreditApprovalMembers.get_approval_members)// student office,head Academics, COE
router.get("/availableRollNumbers",ensureAuthenticated,RollNumbers.get_available_rollnumbers)// Common Api  
router.post("/oc/OneCreditSingleUpload",ensureAuthenticated,OneCreditSingleUpload.post_single_one_credit)// COE
router.get("/oc/SearchingOneCreditCourse",ensureAuthenticated,SearchingOneCredit.get_CourseList_one_credit)// COE
router.post("/oc/DeletingOnecreditCompletion",ensureAuthenticated,DeletingOnecredit.delete_onecredit_course)// COE
router.get("/oc/AllActiveApplications",ensureAuthenticated,AllActiveApllications.get_active_courses_count)// all --------------- need to modify as it contain ce_oc_registered -------- (Done...)
router.get("/oc/ApprovedStatusAll",ensureAuthenticated,approved_status.get_approved_status)// all
router.get("/oc/OnlineCourseApprovalMembers",ensureAuthenticated,OnlineCourseApprovalMembers.get_approval_members)// student HOD,Autonomy Affairs,COE
router.get("/AvailableElectives",ensureAuthenticated,AvailableElectives. get_available_elective)// student ---------- need to modify as it has ce_oc_registered ------------ (Done...)
router.get("/AvailableAcademicYears",ensureAuthenticated,AvailableAcademicYears.get_available_academic_year)// comman to all
router.get("/AvailableSemester",ensureAuthenticated,AvailableSemester.get_academic_semester)// common to all
router.get("/AvailableBranches",ensureAuthenticated,AvailableBranch.get_available_branchs)// common to all
router.get("/TotalElectives",ensureAuthenticated,TotalElectives.get_total_electives)// except student all
router.use("/in/InternApply",ensureAuthenticated,InternshipApply)// student
router.use("/in/InternTrackerApply",ensureAuthenticated,InternTrackerApply)/// student
router.get("/in/AllIndustries",ensureAuthenticated,FetchingAllIndustries.get_all_industries)// student
router.get("/in/Registered",ensureAuthenticated,GetRegisteredIntern.get_registered_intern)// student
router.get("/in/RegisteredInterntrackers",ensureAuthenticated,RegisteredInterntrackers.get_registered_trackers)
router.get("/in/InternApprovalMembers",ensureAuthenticated,InternApprovalMembers.get_approval_members)// student HOD,IIPC,Rewards,COE
router.post("/in/InternShipCompanyApply",ensureAuthenticated,InternShipCompanyApply.add_company)// IIPC 
router.get("/AddHM/AvailableModeOfExemption",ensureAuthenticated,ModeOfExemption.get_mode_of_exemption)// student, Office,Head Academics, COE
router.post("/AddHm/HonorMinorSingleUpload",ensureAuthenticated,HonorMinorSingleUpload.honor_minor_single_upload) // COE
router.post("/AddHm/HonorMinorExcelUpload",ensureAuthenticated,uploadHonorMinor.single('file'),HonorMinorExcelUpload.processExcelFileHonorMinor)// COE
router.post("/AddHm/AddOnExcelUpload",ensureAuthenticated,uploadAddOn.single('file'),AddOnExcelUpload.processExcelFileAddOn)// COE
router.post("/AddHm/AddOnSingleUpload",ensureAuthenticated,AddOnSingleUpload.add_on_single_upload)// COE
router.get("/AddHm/ListOfStudentMappings",ensureAuthenticated,ListOfStudentMappings.get_course_student_mappings)// COE
router.post("/AddHm/DeleteAddOnHonorMinor",ensureAuthenticated,DeleteAddOnHonorMinor.delete_addon_honor_minor)// COE
router.get("/AddHm/CompletedAddonHonorMinor",ensureAuthenticated,CompletedAddonHonorMinor.get_completed_addon_honor_minor)// student
router.post("/AddHm/ApplyAddonHonorMinor",ensureAuthenticated,ApplyAddonHonorMinor.apply_addon_honor_minor)// student
router.get("/AddHm/AddonHmApprovalMembers",ensureAuthenticated,AddonHmApprovalMembers.get_approval_members)// student, Office,Head Academics, COE
router.post("/in/InternExcelUpload",ensureAuthenticated,uploadIntern.single('file'),InternExcelUpload.processExcelFileIntern)// IIPC
router.get("/in/InternCompanySearch",ensureAuthenticated,InternCompanySearch.get_company_list)// IIPC
router.post("/in/InternCompanyEdit",ensureAuthenticated,InternCompanyEdit.edit_company_details)// IIPC
router.post("/in/InternCompanyDelete",ensureAuthenticated,InternCompanyDelete.delete_company)// IIPC
router.get("/oc/ApprovedOnlineCourse",ensureAuthenticated,ApprovedOnlineCourse.get_approved_applications)// HOD, Autonomy Affairs, COE ------ need to modify as it contains ce_oc_registered ---------- (Done...)
router.get("/oc/RejectedOnlineCourse",ensureAuthenticated,RejectedOnlineCourse.get_rejected_applications)// HOD, Autonomy Affairs, COE ------ need to modify as it contains ce_oc_registered ---------- (Done...)
router.post("/oc/RevokeOnlineCourse",ensureAuthenticated,RevokeOnlineCourse.revoke_student_status)// HOD, Autonomy Affairs, COE  ------ need to modify as it contains ce_oc_registered ---------- (Done...)
router.get("/oc/ActiveApplicationOnlineForValidation",ensureAuthenticated,ActiveApplicationOnlineForValidation.get_active_applications_student_course)// student ------------------ need to modify as it contains ce_oc_registered ---------------- (Done...)
router.get("/in/PendingInternApplications",ensureAuthenticated,PendingInternApplications.get_pending_interns)//HOD,IIPC,Rewards,COE
router.post("/in/ToApproveInternship",ensureAuthenticated,ToApproveInternship.post_approve_internships)//HOD,IIPC,Rewards,COE
router.post("/in/ToRejectInternship",ensureAuthenticated,ToRejectInternship.post_reject_intern)//HOD,IIPC,Rewards,COE
router.get("/in/ApprovedInternship",ensureAuthenticated,ApprovedInternship.get_approved_interns)//HOD,IIPC,Rewards,COE
router.post("/in/RevokingIntern",ensureAuthenticated,RevokingIntern.revoke_intern_status)//HOD,IIPC,Rewards,COE
router.get("/in/RejectedInternship",ensureAuthenticated,RejectedInternship.get_rejected_interns)//HOD,IIPC,Rewards,COE
router.get("/oneCredit/PendingOneCredit",ensureAuthenticated,PendingOneCredit.get_pending_one_credit)// Office,Head Academics, COE
router.post("/oneCredit/ToApproveOneCredit",ensureAuthenticated,ToApproveOneCredit.post_approve_one_credit)// Office,Head Academics, COE
router.post("/oneCredit/ToRejectOneCredit",ensureAuthenticated,ToRejectOneCredit.post_reject_one_credit)// Office,Head Academics, COE
router.get("/oneCredit/ApprovedOneCredit",ensureAuthenticated,ApprovedOneCredit.get_approved_one_credit)// Office,Head Academics, COE
router.get("/oneCredit/RejectedOneCredit",ensureAuthenticated,RejectedOneCredit.get_rejected_one_credit)// Office,Head Academics, COE
router.post("/oneCredit/RevokingOneCredit",ensureAuthenticated,RevokingOneCredit.revoke_one_credit_status)// Office,Head Academics, COE
router.get("/AddHm/PendingAddonHonorMinor",ensureAuthenticated,PendingAddonHonorMinor.get_pending_addon_honor_minor)// Office,Head Academics, COE
router.get("/AddHm/ApprovedAddonHonorMinor",ensureAuthenticated,ApprovedAddonHonorMinor.get_approved_addon_honor_minor)// Office,Head Academics, COE
router.get("/AddHm/RejectedAddonHonorMinor",ensureAuthenticated,RejectedAddonHonorMinor.get_rejected_addon_honor_minor)// Office,Head Academics, COE
router.post("/AddHm/ToApproveAddonHonorMinor",ensureAuthenticated,ToApproveAddonHonorMinor.post_approve_addon_honor_minor)// Office,Head Academics, COE
router.post("/AddHm/ToRejectAddonHonorMinor",ensureAuthenticated,ToRejectAddonHonorMinor.post_reject_addon_honor_minor)// Office,Head Academics, COE
router.post("/AddHm/RevokingAddonHonorMinor",ensureAuthenticated,RevokingAddonHonorMinor.revoke_addon_honor_minor)// Office,Head Academics, COE
router.post("/AddHm/ClearingAddonHonorMinor",ensureAuthenticated,ClearingAddonHonorMinor.post_clearance_addon_honor_minor)// Office,Head Academics, COE
router.get("/AddHm/AddHmActiveCoursesForValidation",ensureAuthenticated,AddHmActiveCoursesForValidation.get_active_applications_addHm_for_validation)// student
router.get("/in/InternTrackerApprovals",ensureAuthenticated,InternTrackerApprovals.get_interns_approvals)/// faculty IIPC only

router.post("/FilterOnlineReport",ensureAuthenticated,FilterOnlineReport.filter_online_report) // except student -------- need to modify this as it contains ce_oc_registered
router.post("/FilterOneCreditReport",ensureAuthenticated,FilterOneCreditReport.filter_one_credit_report)// except student
router.post("/FilterInternReport",ensureAuthenticated,FilterInternReport.filter_intern_report)// except student
router.post("/FilterAddonReport",ensureAuthenticated,FilterAddonReport.filter_addon_report)// except student
router.post("/FilterHonorReport",ensureAuthenticated,FilterHonorReport.filter_honor_report)// except student
router.post("/FilterMinorReport",ensureAuthenticated,FilterMinorReport.filter_minor_report)// except student


// router.post("/oc/registered", pdf_uploader_middleware ,oc_registered_details.post_registered)

module.exports = router;