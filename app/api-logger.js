module.exports = function(err, res, code) {
  if(res)
    res.status(code).send("API ERROR: " + err);
}
