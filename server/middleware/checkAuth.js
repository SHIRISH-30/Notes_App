exports.isLoggedIn=function(req,res,next){
  if(req.user)
  {
    next();
  }
if(!req.user)
{
    console.log(req.user)
    return res.status(401).send("Acess Denied")
}
}