const post_image = async (request, res) => {
  let file = request.files.file
  file.url = `files/${Date.now()}_${file.name}`
  await file.mv(file.url)
  res.status(201).json({name: file.name, url: file.url})
}


module.exports = {
  post_image
}