const Note = require("../models/Notes");
const mongoose = require("mongoose");

exports.dashboard = async (req, res) => {

  let perPage = 8;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };
 try {
  //pagination
  Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec(function (err, notes) {
        Note.count().exec(function (err, count) {
          if (err) return next(err);
          res.render("dashboard/index", {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage),
          });
        });
      });
 } catch (error) {
  console.log(error)
 }

}

exports.ViewNote=async(req,res)=>{
  try {
    const note=await Note.findById({_id:req.params.id}).where({user:req.user.id})
  if(note){
    res.render("dashboard/view-page",{
   note,
   noteID:req.params.id,
   layout: "../views/layouts/dashboard"
   });
  }else{
    res.send("Something wnet wrong");
  }
    
  } catch (error) {
    console.log(error);
  }
}
exports.UpdateNote=async(req,res)=>{
  try {
    await Note.findByIdAndUpdate({
      _id:req.params.id
      //where me user wala id and baaki jagah note id
    },{title:req.body.title,body:req.body.body}).where({user:req.user.id})
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error)
  }
}

exports.deleteNote=async(req,res)=>{
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  
}}

exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add-note", {
    layout: "../views/layouts/dashboard",
  });
};

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    //user in model of note hence we had to do it
    req.body.user=req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
    
  } catch (error) {
    console.log(error);
  }
}

exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {}
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};