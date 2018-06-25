const moment = require('moment');
const knex = require('./.config.db');

function getFile(fecha) {
    let fechaformat = moment(fecha, "DD/MM/YYYY").format('YYYY/MM/DD 00:00:00');
    return new Promise((resolve, reject) => {
        knex
            .select(knex.raw('year,day,week,filename,composition'))
            .from(knex.raw("ocean_color_satmo_nc"))
            .whereRaw(`composition IN ('whs', 'wy-nsst', 'sba', 'dhw')  AND product_date='${fechaformat}'`)
            .orderByRaw(`
            case 
            when composition ='sba' then 1
            when composition ='dhw' then 2
            when composition ='whs' then 3
            when composition ='wy-nsst' then 4
            end asc
            `)
            .then(function (dato) {
                resolve({ file: JSON.parse(JSON.stringify(dato)) })
            })
            .catch(e => { console.log(e); reject(e) });
    })
}
function getLevel(fecha, idanp) {
    let fechaformat = moment(fecha, "DD/MM/YYYY").format('YYYY/MM/DD 00:00:00');
    let year = moment(fecha, "DD/MM/YYYY").format('YYYY');
    return new Promise((resolve, reject) => {
        knex
            .select(knex.raw(`a.gid_anp as idanp,a.level,REPLACE(b.region,'ANP INCLUIDAS EN LA ALERTA REGIONAL. ','') as region,b.anp`))
            .from(knex.raw("anp_alerts_levels a"))
            .joinRaw(`INNER JOIN anp_alerts b on b.gid =a.gid_anp`)
            .whereRaw(`a.year = ${year} AND a.gid_anp= ${idanp} AND a.week = (SELECT week FROM ocean_color_satmo_nc WHERE product_date='${fechaformat}' and week is not null limit 1)`)
            .then(function (dato) {
                resolve({ level: JSON.parse(JSON.stringify(dato)) })
            })
            .catch(e => { console.log(e); reject(e) });
    })
}
function get(fecha, idanp) {
    return new Promise((resolve, reject) => {
        Promise.all([getFile(fecha), getLevel(fecha, idanp)]).then(values => {
            resolve(JSON.parse(JSON.stringify(values)))
        });
    })
}
function getCapas(fecha, idanp) {
    return new Promise((resolve, reject) => {
    get(fecha, idanp)
        .then(dato => {
            let capas = [
                dato[0]['file'][0]['filename'].replace('.tif', '_relief.tif').replace('GHRSST', 'simar_WY-NSST_GHRSST'),
                dato[0]['file'][1]['filename'].replace('.tif', '_relief.tif').replace('SATCORAL', 'simar_WHS_SATCORAL'),
                dato[0]['file'][2]['filename'].replace('.tif', '_relief.tif').replace('SATCORAL', 'simar_DHW_SATCORAL'),
                dato[0]['file'][3]['filename'].replace('.tif', '_relief.tif').replace('SATCORAL', 'simar_SBA_SATCORAL')
            ];
            resolve(capas)
        })
    })
}
module.exports = {
    getFile,
    getLevel,
    get,
    getCapas
}