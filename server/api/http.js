import * as service from './service/event';
import multer from 'multer';
import s3 from 'multer-s3';
import path from 'path';
// import sizeOf from 'image-size';
require('dotenv').config();
import size from 's3-image-size';
var AWS = require('aws-sdk');

export function getEvents(req, res) {
  service.getEvents()
  .then((events) => res.json(events))
  .catch(err => {
    res.status(400);
    res.json({error: err});
  });
}

export function uploadImage(req, res) {
  const options = s3({
    dirname: 'uploads/images',
    bucket: 'projectsuploads',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: 'eu-west-1',
    filename: (req, file, cb) => {
      cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
    }
  })
  const uploading = multer({ storage: options }).array('file');
  uploading(req, res, err => {
    let files = []

    // function shitFunction() {
    //   return req.files.map((file) => {
    //     size(s3size, 'imagesuploads', file.key, (err, dimensions, length) => {
    //       let imgDimensions = dimensions.width/dimensions.height;
    //       files.push({key:file.key.replace("uploads/images/", ""), dimensions: imgDimensions});
    //       console.log('req',req.files.length)
    //       console.log('files',files.length)
    //       // if (req.files.length === files.length) {
    //       //   console.log('finished1')
    //       //   resolve(files);
    //       // }
    //     });
    //   })
    // }

    // fs.shitFunction()
    // .then((files) => res.json(files))
    // .catch(err => {
    //   res.status(400);
    //   res.json({error: err, event: req.body});
    // });

    const p1 = new Promise((resolve, reject) => {
      req.files.map((file) => {
        console.log('files-start-map', files.length)
        // size(s3size, 'imagesuploads', file.key, (err, dimensions, length) => {
        //   console.log(err)
        //   let imgDimensions = dimensions.width/dimensions.height;
        //   files.push({key:file.key.replace("uploads/images/", ""), dimensions: imgDimensions});
        //   console.log('files-finish-map', files.length)
        //   // if (req.files.length === files.length) {
        //   //   console.log('finished1')
        //   //   resolve(files);
        //   // }
        // });

        files.push({key:file.key.replace("uploads/images/", "")});
        console.log('files-finish-map', files.length);
      })
      const timer = setInterval(() => {
        console.log('req',req.files.length)
        console.log('files',files.length)

        if (req.files.length === files.length) {
          console.log('finished')
          stopTimer();
          resolve(files);
        }
      }, 300);

      const stopTimer = function() {
        clearInterval(timer);
      }

      // setTimeout(() => {
      //   console.log(files)
      //   resolve(files);
      // }, 3000);
    });

    p1.then((files) => res.json(files))
    p1.catch(err => {
      res.status(400);
      res.json({error: err, event: req.body});
    });
  })
}

export function deleteImage(req, res) {
  console.log('delete')
}

export function addEvent(req, res) {
  service.addEvent(req.body)
  .then((event) => res.json(event))
  .catch(err => {
    res.status(400);
    res.json({error: err, event: req.body});
  });
}

export function editEvent(req, res) {
  const options = s3({
    dirname: 'uploads/images',
    bucket: 'imagesuploads',
    secretAccessKey: '9N620NwIxOu53dn8Vtjpw3TlmVVPdb1R6ahEJbeD',
    accessKeyId: 'AKIAJ4KEEK4LIY2HFMXQ',
    region: 'eu-west-1',
    filename: (req, file, cb) => {
      cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
    }
  })
  const uploading = multer({ storage: options }).array('file');
  uploading(req, res, err => {
    let images = []
    req.body.images.map((image) => {
      images.push({key:image.key, caption:image.caption});
    })
    service.editEvent(req.params.id, req.body, images)
    .then((event) => res.json(event))
    .catch(err => {
      res.status(400);
      res.json({error: err, event: req.body});
    });
  })
}

// export function editEvent(req, res) {
//   const options = s3({
//     dirname: 'uploads/images',
//     bucket: 'imagesuploads',
//     secretAccessKey: '9N620NwIxOu53dn8Vtjpw3TlmVVPdb1R6ahEJbeD',
//     accessKeyId: 'AKIAJ4KEEK4LIY2HFMXQ',
//     region: 'eu-west-1',
//     filename: (req, file, cb) => {
//       cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname));
//     }
//   })
//   const uploading = multer({ storage: options }).array('file');
//   uploading(req, res, err => {
//     let files = []
//     let images = []
//     if (req.files) {
//       req.files.map((file) => {
//         // let imgDimensions;
//         size(s3size, 'imagesuploads', file.key, (err, dimensions, length) => {
//           let imgDimensions = dimensions.width/dimensions.height;
//           files.push({key:file.key.replace("uploads/images/", ""), dimensions: imgDimensions});
//           console.log(files);
//           service.editEvent(req.params.id, req.body, files)
//           .then((event) => res.json(event))
//           .catch(err => {
//             res.status(400);
//             res.json({error: err, event: req.body});
//           });
//         });
//       })
//     }
//     // if (req.body.image) {
//     //   req.body.image.map((image) => {
//     //     images.push({key:image});
//     //   })
//     //   console.log(files)
//     //   images = files.concat(images);
//     // } else {
//     //   images = files;
//     // }

//     // service.editEvent(req.params.id, req.body, images)
//     // .then((event) => res.json(event))
//     // .catch(err => {
//     //   res.status(400);
//     //   res.json({error: err, event: req.body});
//     // });
//   })

//   // service.editEvent(req.params.id, req.body)
//   // .then((event) => res.json(event))
//   // .catch(err => {
//   //   res.status(400);
//   //   res.json({error: err, event: req.body});
//   // });
// }

export function deleteEvent(req, res) {
  const key = 'uploads/images/'.concat(req.headers.images);
  s3({
    dirname: 'uploads/images',
    bucket: 'imagesuploads',
    secretAccessKey: '9N620NwIxOu53dn8Vtjpw3TlmVVPdb1R6ahEJbeD',
    accessKeyId: 'AKIAJ4KEEK4LIY2HFMXQ',
    key: key,
    region: 'eu-west-1'
  })
  .s3.deleteObject({ Bucket: 'imagesuploads', Key: key }, function(err, data) {
    if (err) console.log(err);
    else {
      console.log('delete', data);
    }
  })

  service.deleteEvent(req.params.id)
  .then((event) => res.json(event))
  .catch(err => {
    res.status(400);
    res.json({error: err, event: req.body});
  });
}

export function getEvent(req, res) {
  service.getEvent(req.params.slug)
  .then((event) => res.json(event))
  .catch(err => {
    console.log(err)
    res.status(400);
    res.json({error: err, event: req.body});
  });
}
