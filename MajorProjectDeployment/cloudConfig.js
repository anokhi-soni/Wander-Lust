const cloudinary = require('cloudinary').v2; // means we're using the version 2 of cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ // config => configuring (jodana) => means we're trying to configure/joine our backend to our cloudinary account
    cloud_name : process.env.CLOUD_NAME,    // By default we've to keep the key names as cloud_name, api_key, api_secret cuz cloudinaey account has these names only as keys
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})


const storage = new CloudinaryStorage({ // this storage variable will act as the storage where all of th files uplaoded by the user will get stored
  cloudinary: cloudinary, //
  params: {
    folder: 'wanderlust_DEVLOPMENT', // specifying the folder where the files should get stored
    allowedFormats: ["png", "jpg", "jpeg", "pdf"], 
    // The code above basiically means we want to create a folder wanderlust_DEVLOPMENT on cloudinary acount which will store the above mentioned files
  },
});

module.exports = {
    cloudinary,
    storage
}