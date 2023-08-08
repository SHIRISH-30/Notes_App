const express=require("express");
const router=express.Router();
const dashboardController=require("../controllers/dashController");
const {isLoggedIn}=require("../middleware/checkAuth")

router.get("/dashboard",isLoggedIn,dashboardController.dashboard)
router.get("/dashboard/item/:id",isLoggedIn,dashboardController.ViewNote)
router.put("/dashboard/item/:id",isLoggedIn,dashboardController.UpdateNote)
router.delete("/dashboard/item-delete/:id",isLoggedIn,dashboardController.deleteNote)
router.get('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNote);
router.post('/dashboard/add', isLoggedIn, dashboardController.dashboardAddNoteSubmit);
router.get('/dashboard/search', isLoggedIn, dashboardController.dashboardSearch);
router.post('/dashboard/search', isLoggedIn, dashboardController.dashboardSearchSubmit);




module.exports=router;
