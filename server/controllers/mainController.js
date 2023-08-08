//GET REQ of homepage
module.exports.homepage=async(req,res)=>{
   const locals={
    title:"NODEJS-NOTES",
    description:"FREE NODE JS NOTES APP"
   }
   
    res.render("index",{locals,
    layout:"../views/layouts/front-page.ejs"
      });
}
module.exports.aboutpage=async(req,res)=>{
    const locals={
        title:"NODEJS-ABOUT",
        description:"ABOUT PAGE"
    }
    res.render("about",locals)
}