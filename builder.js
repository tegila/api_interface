import fetch from 'node-fetch';
import qs from 'querystring';

import demo from './demo.json'

const base_url = demo.base_url;
delete demo["base_url"];

const template_apply = (source, params) => {
  let _source = source;
  for (const [target, value] of Object.entries(params)) {
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
    root[key] = (params, query, data) => {      
      let _endpoint = template_apply(object.endpoint, params);
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

const ret = unwrap_methods(demo);

// console.log(ret);
/*
ret.item.view({ item_id: "MLB999112557" })
.then(res => res.json())
.then(json => console.log(json));
*/
export default ret;
