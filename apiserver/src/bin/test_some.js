#!/usr/bin/node
//= test_some.js

if (false) {
  let updates_tokens = 0;
  const my_array = [9,4,6,3,7,7,1];
  for (let index in my_array) {
    const element = my_array[index];
    console.log("# element = ", element);
    updates_tokens += 1;
  }
  console.log("# updates_tokens = ", updates_tokens);
}

const return_new_array_remove_all_occurences_array_element = function(old_array, element) {
  let my_set = new Set(old_array);
  my_set.delete(element);
  const new_array = [...my_set];
  return new_array;
}

if (false) {
  let presence_alist = ["91","92","93"];
  // let presence_set = new Set(presence_alist);
  // presence_set.delete("92");
  // let new_presence_alist = [...presence_set];
  let new_presence_alist = return_new_array_remove_all_occurences_array_element(presence_alist, "92");
  console.log("# new_presence_alist = ", new_presence_alist);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

if (false) {
  const c_tech_LoRaWAN_TechTenna  = "LoRaWAN:TechTenna";
  const c_tech_WiFi_THT           = "WiFi:THT";
  const short_tech_list = {
    "wt": c_tech_WiFi_THT,
    "lt": c_tech_LoRaWAN_TechTenna,
  };
  // const short_tech = getKeyByValue(short_tech_list, "WiFi:THT");
  const short_tech = getKeyByValue(short_tech_list, "LoRaWAN:TechTenna");
  console.log("# short_tech = ", short_tech);
}

if (false) {
  const pjson = require('root-require')('package.json');
  const app_version = 'v' + pjson.version || '?.?.?';
  let mongoose_version = pjson.dependencies.mongoose || 'na';
  mongoose_version = mongoose_version.replace(/\^|\~/g, "");
  // console.log("# process.version = ", process.version);   // v14.18.2
  // console.log("# process.versions = ", process.versions);  
  // # process.versions =  {
  //   node: '14.18.2',
  //   v8: '8.4.371.23-node.85',
  //   uv: '1.42.0',
  //   zlib: '1.2.11',
  //   brotli: '1.0.9',
  //   ares: '1.18.1',
  //   modules: '83',
  //   nghttp2: '1.42.0',
  //   napi: '8',
  //   llhttp: '2.1.4',
  //   openssl: '1.1.1l',
  //   cldr: '39.0',
  //   icu: '69.1',
  //   tz: '2021a',
  //   unicode: '13.0'
  // }
  console.log("# mongoose_version = ", mongoose_version);
}

if (false) {
  conv_string = "v05:s048c:a41:e6079e77b:t42,b01,r01,m01:t48,b02,r02,m02:t00,b03,r03,m03:t00,b04,r04,m04:t00,b05,r05,m05.";
  conv_string = conv_string.replace(/v05:s/g, '');
  conv_string = conv_string.replace(/:[aet]/g, ':');
  conv_string = conv_string.replace(/,[brm]/g, ',');
  conv_string = conv_string.replace(/\./g, '');
  console.log(`# conv_string = "${conv_string}" .`);
}

const hexShortStringToInt = function(hex) {
  let decimal_number = parseInt(Number("0x"+hex), 10);
  return decimal_number;
}
if (false) {
  const hex = "22";
  const decimal_number = hexShortStringToInt(hex);
  console.log(`# hex = "${hex}", decimal_number = "${decimal_number}" .`);
}

if (true) {
  let token_list = [
    { tid: '54', bpl: '53', rsi: '0e', mis: '00' },
    { tid: '57', bpl: '53', rsi: '0c', mis: '00' },
    { tid: '51', bpl: '50', rsi: '12', mis: '00' },
    { tid: '53', bpl: '51', rsi: '11', mis: '00' },
    { tid: '62', bpl: '56', rsi: '0c', mis: '00' }
  ];
  let token_list_sorted = [];
  //
  // token_list_sorted = token_list.sort();
  //
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  // token_list_sorted = token_list.sort( (a,b) => { (b.tid > a.tid) ? 1 : (a.tid > b.tid) ? -1 : 0 } );
  //
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  token_list_sorted = token_list.sort( (a,b) => {
    const at = a.tid;
    const bt = b.tid;
    const comp = at.localeCompare(bt);
    console.log(`# at=${at} bt=${bt} comp=${comp} .`);
    return comp;
  });
  //
  // console.log(`# (func_decode_rawstring) token_list=${ token_list.map(t => t.token_id) } .`);
  console.log('# (func_decode_rawstring) token_list_sorted ', token_list_sorted.map(t => t.tid) );
  // console.log('# (func_decode_rawstring) token_list ', token_list);
  // console.log('# (func_decode_rawstring) token_list_sorted ', token_list_sorted);
}
if (false) {
  const token_list = [
    '54',
    '57',
    '51',
    '53',
    '62',
  ];
  // let token_list_sorted = token_list.sort( (a,b) => { (b > a) ? 1 : (a > b) ? -1 : 0 } );
  token_list.sort();
  //
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
  // token_list.sort( (a,b) => { a.localeCompare(b) } );
  //
  // console.log(`# (func_decode_rawstring) token_list=${ token_list.map(t => t.token_id) } .`);
  console.log('# (func_decode_rawstring) token_list ', token_list );
  // console.log('# (func_decode_rawstring) token_list ', token_list);
  // console.log('# (func_decode_rawstring) token_list_sorted ', token_list_sorted);
}

if (false) {
  const d220303_ttn_example = 
{
  "end_device_ids":{"device_id":"anchor-a82","application_ids":{"application_id":"office"},"dev_eui":"2CF7F120323080A5","join_eui":"8000000000000006","dev_addr":"260896CC"},"correlation_ids":["as:up:01FX8BQ0CZ2VACP569FKJ498NB","gs:conn:01FX7YXPB75DTSBMKBVKGHT9JQ","gs:up:host:01FX7YXPBVQD7PNPSH4VQ25FW7","gs:uplink:01FX8BQ05ZA0ZE9FJPCZANTC98","ns:uplink:01FX8BQ062YVQRYM7PSFTF4WKJ","rpc:/ttn.lorawan.v3.GsNs/HandleUplink:01FX8BQ0615H44W9ATR6R8MY8G","rpc:/ttn.lorawan.v3.NsAs/HandleUplink:01FX8BQ0CYS5RG6ZKEJ9TGE1FD"],"received_at":"2022-03-03T17:02:20.063750275Z","uplink_message":{"session_key_id":"AX9Qmo4iK2k26ZRcM+m6Tg==","f_port":8,"f_cnt":272,"frm_payload":"dgUAZ1FQU1FSTQ==","decoded_payload":{"aid":103,"t01_bat":80,"t01_id":81,"t02_bat":81,"t02_id":83,"t03_bat":77,"t03_id":82,"t04_bat":null,"t04_id":null,"t05_bat":null,"t05_id":null,"t06_bat":null,"t06_id":null,"t07_bat":null,"t07_id":null,"t08_bat":null,"t08_id":null,"t09_bat":null,"t09_id":null,"t10_bat":null,"t10_id":null,"t11_bat":null,"t11_id":null,"t12_bat":null,"t12_id":null,"t13_bat":null,"t13_id":null,"t14_bat":null,"t14_id":null,"t15_bat":null,"t15_id":null,"ver":5},"rx_metadata":[{"gateway_ids":{"gateway_id":"dragino-203d74","eui":"A84041FFFF203D74"},"time":"2022-03-03T17:02:19.796380996Z","timestamp":519442250,"rssi":-97,"channel_rssi":-97,"snr":9.5,"uplink_token":"ChwKGgoOZHJhZ2luby0yMDNkNzQSCKhAQf//ID10EMqe2PcBGgwIm+mDkQYQ0dG4kAMgkPKuiY+GAyoMCJvpg5EGEMSe3/sC"},{"gateway_ids":{"gateway_id":"dragino-2058f4","eui":"A84041FFFF2058F4"},"time":"2022-03-03T17:02:19.705698966Z","timestamp":699246214,"rssi":-91,"channel_rssi":-91,"snr":10.75,"uplink_token":"ChwKGgoOZHJhZ2luby0yMDU4ZjQSCKhAQf//IFj0EIbNts0CGgwIm+mDkQYQs/38mwMg8PbJ8qyRASoMCJvpg5EGEJa5wNAC"}],"settings":{"data_rate":{"lora":{"bandwidth":125000,"spreading_factor":7}},"coding_rate":"4/5","frequency":"868500000","timestamp":519442250,"time":"2022-03-03T17:02:19.796380996Z"},"received_at":"2022-03-03T17:02:19.842180468Z","consumed_airtime":"0.061696s","network_ids":{"net_id":"000013","tenant_id":"token","cluster_id":"eu1"}}
};
  const pretty = JSON.stringify(d220303_ttn_example, null, 2);
  console.log(`# pretty: `, pretty);
}


//-EOF