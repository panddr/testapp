// import r from 'rethinkdb';
// import rethinkdbdash from 'rethinkdbdash';
// let r = rethinkdbdash();

const r = require('rethinkdbdash')(config.get('rethinkdb'));

import config from 'config';
import xss from 'xss';
import Mdash from 'mdash-node';
import marked from 'marked';
import slug from 'limax';

function connect() {
  return r.connect(config.get('rethinkdb'));
}

export function liveUpdates(io) {
  console.log('Setting up listener...');
  r
    .table('pulses')
    .changes().run((err, cursor) => {
      console.log('Listening for changes...');
      cursor.each((err, change) => {
        console.log('Change detected', change);
        io.emit('event-change', change);
      });
    });

  // connect()
  // .then(conn => {
  //   r
  //   .table('pulses')
  //   .changes().run(conn, (err, cursor) => {
  //     console.log('Listening for changes...');
  //     cursor.each((err, change) => {
  //       console.log('Change detected', change);
  //       io.emit('event-change', change);
  //     });
  //   });
  // });
}

export function getEvents() {
  return r
    .table('pulses')
    .orderBy(r.desc('yearStart')).run();

  // return connect()
  // .then(conn => {
  //   return r
  //   .table('pulses')
  //   .orderBy(r.desc('created')).run(conn)
  //   .then(cursor => cursor.toArray());
  // });
}

// export function uploadImage(images) {
//   return connect()
//   .then(conn => {
//     return r
//     .table('pulses')
//     .get(id).update(event).run(conn)
//     .then(() => event);
//   });
// }

export function addEvent(event) {
  const md = marked(event.description.toString(), {sanitize: true});
  const desciptionTp = new Mdash(md);
  const titleTp = new Mdash(event.title);
  const tp = new Mdash(md);
  event.created = new Date();
  event.description = xss(event.description);
  event.descriptionFormated = desciptionTp.format();
  event.titleFormated = titleTp.format();
  event.slug = slug(event.title) + '-' + event.id;

  return r
    .table('pulses')
    .insert(event).run()
    .then(response => {
      return Object.assign({}, event, {id: response.generated_keys[0]});
    });

  // return connect()
  // .then(conn => {
  //   event.created = new Date();
  //   event.description = xss(event.description);
  //   event.slug = slug(event.title);
  //   return r
  //   .table('pulses')
  //   .insert(event).run(conn)
  //   .then(response => {
  //     return Object.assign({}, event, {id: response.generated_keys[0]});
  //   });
  // });
}

export function editEvent(id, event) {
  const md = marked(event.description.toString(), {sanitize: true});
  const desciptionTp = new Mdash(md);
  const titleTp = new Mdash(event.title);
  const tp = new Mdash(md);
  event.updated = new Date();
  event.description = xss(event.description);
  event.descriptionFormated = desciptionTp.format();
  event.titleFormated = titleTp.format();
  event.slug = slug(event.title) + '-' + event.id;
  return r
    .table('pulses')
    .get(id).update(event).run()
    .then(() => event);

  // return connect()
  // .then(conn => {
  //   return r
  //   .table('pulses')
  //   .get(id).update(event).run(conn)
  //   .then(() => event);
  // });
}

export function deleteEvent(id) {
  return r
    .table('pulses')
    .get(id).delete().run()
    .then(() => ({id: id, deleted: true}));

  // return connect()
  // .then(conn => {
  //   return r
  //   .table('pulses')
  //   .get(id).delete().run(conn)
  //   .then(() => ({id: id, deleted: true}));
  // });
}

export function getEvent(slug) {
  return r
    .table('pulses')
    .getAll(slug, {index: 'slug'}).run()

  // return connect()
  // .then(conn => {
  //   return r
  //   .table('pulses')
  //   .getAll(slug, {index: 'slug'}).run(conn)
  //   .then(cursor => cursor.toArray());
  // });
}
