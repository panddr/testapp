import * as service from './service/event';
import multer from 'multer';
import s3 from 'multer-s3';
import path from 'path';

const secretAccessKey = '9N620NwIxOu53dn8Vtjpw3TlmVVPdb1R6ahEJbeD';
const accessKeyId = 'AKIAJ4KEEK4LIY2HFMXQ';

export function getEvents(req, res) {
  service.getEvents()
  .then((events) => res.json(events))
  .catch(err => {
    res.status(400);
    res.json({error: err});
  });
}

export function addEvent(req, res) {
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
  const uploading = multer({ storage: options }).single('images');
  uploading(req, res, err => {
    const key = req.file.key;
    const filename = key.replace('uploads/images/', '');

    service.addEvent(filename, req.body)
    .then((event) => res.json(event))
    .catch(err => {
      res.status(400);
      res.json({error: err, event: req.body});
    });
  })
}

export function editEvent(req, res) {
  service.editEvent(req.params.id, req.body)
  .then((event) => res.json(event))
  .catch(err => {
    res.status(400);
    res.json({error: err, event: req.body});
  });
}

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

