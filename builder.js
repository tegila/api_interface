import fetch from 'node-fetch';
import qs from 'querystring';

import sample from './sample.json'

const base_url = "https://api.mercadolibre.com";

const template_apply = (source, replaceables) => {
  let _source = source;
  for (const [target, value] of Object.entries(replaceables)) {
    const r = new RegExp(`\\\${${target}}`, "i");
    _source = _source.replace(r, value);
  }
  return _source;
}

const unwrap_methods = (objects, root = {}) => {
  for (const [key, object] of Object.entries(objects)) {
    if (!object.method) {
      unwrap_methods(object, root[key] = {});
      continue;
    }
    // !! IMPORTANT HERE !!
    root[key] = (replaceables, query, data) => {      
      let _endpoint = template_apply(object.endpoint, replaceables);
      console.log(_endpoint);
      _endpoint = `${base_url}${_endpoint}`;
      if(query) _endpoint += `?${qs.stringify(query)}`;
      
      return fetch(_endpoint, { 
        method: object.method,
        body: JSON.stringify(Object.assign({}, object.body, data)),
        headers: { 'Content-Type': 'application/json' }
      });
    };
  }
  return root;
}

const ret = unwrap_methods(sample);
ret.item.view({ item_id: "MLB999112557" })
.then(res => res.json())
.then(json => console.log(json));
