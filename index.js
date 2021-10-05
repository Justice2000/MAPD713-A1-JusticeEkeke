var SERVER_NAME = 'Image-api'
var PORT = 5000;
var HOST = '127.0.0.1';

var getCounter = 0;
var postCounter = 0;
var deleteCounter = 0;


var restify = require('restify')

  // Get a persistence engine for the image
  , imagesSave = require('save')('images')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /images') 
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

  // Get all images in the system
  server.get('/images', function (req, res, next) {

    getCounter = getCounter +1;
    console.log("/images - GET request - Recieved request")

    // Find every entity within the given collection
  imagesSave.find({}, function (error, images) {
  
     // Return all of the images in the system
     console.log("/images - GET request - Sending response getCounter:" + getCounter)
     res.send(images)
  })
})

// Create a new image
server.post('/images', function (req, res, next) {

    postCounter = postCounter +1;
    console.log("/images - POST request - Recieved request")
    var newImage = {
        name: req.params.name,
        url: req.params.url,
        size: req.params.size
      }
  
    // Create the image using the persistence engine
    imagesSave.create( newImage, function (error, image) {
  
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send the image if no issues
      console.log("/images - POST request - Sending response postCounter:" + postCounter)
      res.send(201, image)
    })
  })

  //Delete all images
  server.del('/images' , function (req, res, next){

    deleteCounter = deleteCounter +1;
    console.log("/images - DELETE request - Recieved request")
    // Delete images with the persistence engine
    imagesSave.deleteMany({}, function (error, images) {
  
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))
  
      // Send a 200 OK response
      console.log("/images - DELETE request - Recieved request deleteConter:" + deleteCounter)
      res.send()
    })
  })