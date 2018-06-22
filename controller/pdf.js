const PDFDocument = require('pdfkit')
const lib = require('./pgquery.js');
const moment = require('moment');

//fuente
//https://fonts.google.com/specimen/Nunito+Sans?selection.family=Nunito+Sans

let fechaImpre = moment().format('DD/MM/YYYY, hh:mm:ss a');
let rutas = [
    {},
    { pid: 1, id: 'z31', anp: 'Golfo de California: Bahía de Loreto', ruta: 'Golfo_de_California/ANP_cartografia_Z31_newlogo' },
    { pid: 2, id: 'z32', anp: 'Golfo de California: Balandra, Zona marina del Archipiélago de Espíritu Santo', ruta: 'Golfo_de_California/ANP_cartografia_Z32_newlogo' },
    { pid: 3, id: 'z33', anp: 'Golfo de California: Cabo Pulmo', ruta: 'Golfo_de_California/ANP_cartografia_Z33_newlogo' },
    { pid: 4, id: 'z34', anp: 'Golfo de California: Islas Marietas, Islas Marías', ruta: 'Golfo_de_California/ANP_cartografia_Z34_newlogo' },
    { pid: 5, id: 'z21', anp: 'Golfo de México: Arrecife Alacranes', ruta: 'Golfo_de_Mexico/ANP_cartografia_Z21_newlogo' },
    { pid: 6, id: 'z23', anp: 'Golfo de México: Sistema Arrecifal Lobos-tuxpan', ruta: 'Golfo_de_Mexico/ANP_cartografia_Z23_newlogo' },
    { pid: 7, id: 'z22', anp: 'Golfo de México: Sistema Arrecifal Veracruzano', ruta: 'Golfo_de_Mexico/ANP_cartografia_Z22_newlogo' },
    { pid: 8, id: 'z3', anp: 'Mar Caribe: Zona Centro', ruta: 'Mar_Caribe/ANP_cartografia_Z3_newlogo' },
    { pid: 9, id: 'z2', anp: 'Mar Caribe: Zona Centro Norte', ruta: 'Mar_Caribe/ANP_cartografia_Z2_newlogo' },
    { pid: 10, id: 'z4', anp: 'Mar Caribe: Zona Centro Sur', ruta: 'Mar_Caribe/ANP_cartografia_Z4_newlogo' },
    { pid: 11, id: 'z5', anp: 'Mar Caribe: Zona Sur', ruta: 'Mar_Caribe/ANP_cartografia_Z5_newlogo' },
    { pid: 12, id: 'z41', anp: 'Océano Pacifíco: Revillagigedo', ruta: 'Oceano_Pacifico/ANP_cartografia_Z41_newlogo' },
    { pid: 13, id: 'z42', anp: 'Océano Pacifíco: Islas de la Bahía de Chamela: La Pajarera, Cocinas, Mamut, Colorada, San Pedro, San Agustín, San Andrés y Negrita, y los Islotes; Los Anegados, Novillas, Mosca y Submarino', ruta: 'Oceano_Pacifico/ANP_cartografia_Z42_newlogo' },
    { pid: 14, id: 'z43', anp: 'Océano Pacifíco: Huatulco', ruta: 'Oceano_Pacifico/ANP_cartografia_Z43_newlogo' },
    { pid: 15, id: 'z1', anp: 'Mar Caribe: Zona Norte', ruta: 'Mar_Caribe/ANP_cartografia_Z1_newlogo' }
];
function get(req, res, next) {
    //date: DD/MM/YYYY
    let idzona = parseInt(req.params['zona']);
    let fecha= `${req.params['DD']}/${req.params['MM']}/${req.params['YYYY']}`
    console.log(fecha,idzona)
    var doc = new PDFDocument({
        size: 'LETTER', // See other page sizes here: https://github.com/devongovett/pdfkit/blob/d95b826475dd325fb29ef007a9c1bf7a527e9808/lib/page.coffee#L69
        margins: { top: 50, bottom: 50, left: 72, right: 72 },
        info: {
            Title: 'SISTEMA SATELITAL DE ALERTA TEMPRANA (SATCORAL/SIMAR)',
            Author: 'CONABIO 2018',
        }
    });
    lib
        .get(fecha,idzona)
        .then(info => {
            let idalerta = info[1]['level'][0]['level'];
            let day= info[0]['file'][0]['day'];
            let week= info[0]['file'][0]['week'];
            let year= info[0]['file'][0]['year'];
            
            //let rutabase='C:/simar/satmo/L4';
			let rutabase='E:/simar/satmo/L4'
            let sba_img= rutabase+'/SBA/'+year+'/'+info[0]['file'][0]['filename'].replace('.tif','.png');
            let dhw_img= rutabase+'/DHW/'+year+'/'+info[0]['file'][1]['filename'].replace('.tif','.png');
            let whs_img= rutabase+'/WHS/'+year+'/'+info[0]['file'][2]['filename'].replace('.tif','.png');
            let wynsst_img= rutabase+'/WY-NSST/'+year+'/'+info[0]['file'][3]['filename'].replace('.tif','.png');
            
            //++++++++++++++++++++++++++++++++++++++página 1
            doc.moveDown()
            doc.image('images/logo/conabio3.png', 37, 39, { width: 65 })
            doc.moveDown()
            doc.font('fonts/candara.ttf').fontSize(11)
            doc.fontSize(8).text('Fecha impresión: ' + fechaImpre, 435, 20, { width: 500, align: 'justify' })

            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .fillColor('#a61c00')
            .text('SATcoral - Sistema satelital de alerta temprana de blanqueamiento de coral', 115, 45, { width: 490, align: 'left' })

            doc.fillColor('black')
            .font('fonts/NunitoSans-Light.ttf')
            .text('Sistema de Información y Análisis de Ecosistemas Marinos de México - SIMAR', { width: 500, align: 'justify' })
            doc.rect(115, 90, 450, .1).dash(0.2, { space: 0 }).stroke()

            doc.fontSize(12).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Reporte semanal`, 360, 125, { width: 495, align: 'justify' })
            .font('fonts/NunitoSans-Light.ttf')
            .text(`No. ${day}-${week}-${year}`, 455, 125,{ width: 495, align: 'justify' })
            doc.fontSize(11).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fecha de reporte:`, 340, 155, { width: 495, align: 'justify' })
            .font('fonts/NunitoSans-Light.ttf')
            .text(`${fecha}`, 430, 155,{ width: 495, align: 'justify' })
            doc.font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Semana:`, 340, 185, { width: 495, align: 'justify' })
            .font('fonts/NunitoSans-Light.ttf')
            .text(`${week}`, 385, 185,{ width: 495, align: 'justify' })
            doc.font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Año:`, 340, 215, { width: 495, align: 'justify' })
            .font('fonts/NunitoSans-Light.ttf')
            .text(`${year}`, 365, 215,{ width: 495, align: 'justify' })
            doc.font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Región:`, 340, 245, { width: 495, align: 'justify' })
            .font('fonts/NunitoSans-Light.ttf')
            .text(`${rutas[idzona]['anp']}`, 380, 245,{ width: 205, align: 'left' })
            doc.moveDown()
            doc.fontSize(15).text('', 50, 170);
            doc.moveDown()
            doc.image('images/alertas/alerta' + idalerta + '.png', 20, 100, { width: 330 })
            doc.moveDown()
            doc.fontSize(9).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fig. 1. R-SBA:`, 40, 285, { width: 495, align: 'justify' })
            doc.font('fonts/NunitoSans-Light.ttf')
            .text(`Alerta satelital regional de blanqueamiento de corales`, 110, 285, { width: 495, align: 'justify' })
            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Resumen`, 40, 310, { width: 495, align: 'justify' })
            doc.fontSize(12)
            .font('fonts/NunitoSans-Light.ttf').text(`
            La alerta satelital regional de blanqueamiento de corales (R-SBA) es un producto semanal (cada 7 días o semanas del año) basado en la estimación del estrés térmico acumulado en los corales durante las doce semanas previas, sobre la base de los valores de la alerta satelital de blanqueamiento de corales (SBA) a 1-km, para regiones predefinidas dentro de áreas naturales protegidas marinas de México.
Para la región `, 40, 315, { width: 515, align: 'justify', continued: true })
            .font('fonts/NunitoSans-SemiBold.ttf')
            .text(`${rutas[idzona]['anp']} `,{continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`(Fig. 2), se reporta una alerta `,{continued: true})
            .font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Nivel ${idalerta}`,{continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`, según se define en la tabla 1 (Fig. 1).`)

            doc.image('images/mapas_anp/' + rutas[idzona]['ruta'] + '.jpg', 90, 445, { width: 435 })
            doc.fontSize(9).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fig. 2.`,75, 725, { width: 495, align: 'justify',continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`Ubicación de la zona de análisis para el R-SBA dentro de las áreas naturales protegidas marinas de México`)
            doc.moveDown()
            doc.fontSize(10).text('Pag. 1/5', 530, 727, { width: 490, align: 'left' })
            
            //++++++++++++++++++++++++++++++++++++++página 2
            doc.addPage()
            doc.image('images/logo/conabio3.png', 37, 39, { width: 65 })
            doc.moveDown()
            doc.font('fonts/candara.ttf').fontSize(11)
            doc.fontSize(8).text('Fecha impresión: ' + fechaImpre, 435, 20, { width: 500, align: 'justify' })

            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .fillColor('#a61c00')
            .text('SATcoral - Sistema satelital de alerta temprana de blanqueamiento de coral', 115, 45, { width: 490, align: 'left' })

            doc.fillColor('black')
            .font('fonts/NunitoSans-Light.ttf')
            .text('Sistema de Información y Análisis de Ecosistemas Marinos de México - SIMAR', { width: 500, align: 'justify' })
            doc.rect(110, 90, 450, .1).dash(0.2, { space: 0 }).stroke()

            doc.fontSize(8).font('fonts/NunitoSans-Light.ttf')
            .text(`Reporte semanal No. ${day}-${week}-${year}    Semana: ${week}  Año: ${year}   Fecha del reporte: ${fecha}`, 233, 78, { width: 500, align: 'justify' })
            doc.moveDown()

            doc.image('images/logo/conabio3.png', 37, 39, { width: 65 })
            doc.moveDown()
            doc.font('fonts/candara.ttf').fontSize(11)
            doc.fontSize(8).text('Fecha impresión: ' + fechaImpre, 435, 20, { width: 500, align: 'justify' })

            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .fillColor('#a61c00')
            .text('SATcoral - Sistema satelital de alerta temprana de blanqueamiento de coral', 115, 45, { width: 490, align: 'left' })

            doc.fillColor('black')
            .font('fonts/NunitoSans-Light.ttf')
            .text('Sistema de Información y Análisis de Ecosistemas Marinos de México - SIMAR', { width: 500, align: 'justify' })
            doc.rect(110, 90, 450, .1).dash(0.2, { space: 0 }).stroke()

            doc.fontSize(8).font('fonts/NunitoSans-Light.ttf')
            .text(`Reporte semanal No. ${day}-${week}-${year}    Semana: ${week}  Año: ${year}   Fecha del reporte: ${fecha}`, 233, 78, { width: 500, align: 'justify' })
            doc.moveDown()

            doc.image(sba_img, 45, 130, { width: 530 })
            //doc.fontSize(10).text('SBA: Alerta satelital de blanqueamiento de corales', 195, 395, { width: 290, align: 'left' })
            doc.fontSize(9).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fig. 3. SBA: `,195, 400, { width: 495, align: 'justify',continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`Alerta satelital de blanqueamiento de corales`)

            doc.image(dhw_img, 45, 430, { width: 530 })
            //doc.fontSize(10).text('SBA: Alerta satelital de blanqueamiento de corales', 195, 395, { width: 290, align: 'left' })
            doc.fontSize(9).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fig. 4. DHW: `,195, 695, { width: 495, align: 'justify',continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`Grado de calentamiento semanal sobre el coral`)

            doc.fontSize(10).text('Pag. 2/4', 530, 720, { width: 200, align: 'left' })
            doc.addPage()

            //++++++++++++++++++++++++++++++++++++++página 3
            doc.image('images/logo/conabio3.png', 37, 39, { width: 65 })
            doc.moveDown()
            doc.font('fonts/candara.ttf').fontSize(11)
            doc.fontSize(8).text('Fecha impresión: ' + fechaImpre, 435, 20, { width: 500, align: 'justify' })

            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .fillColor('#a61c00')
            .text('SATcoral - Sistema satelital de alerta temprana de blanqueamiento de coral', 115, 45, { width: 490, align: 'left' })

            doc.fillColor('black')
            .font('fonts/NunitoSans-Light.ttf')
            .text('Sistema de Información y Análisis de Ecosistemas Marinos de México - SIMAR', { width: 500, align: 'justify' })
            doc.rect(110, 90, 450, .1).dash(0.2, { space: 0 }).stroke()

            doc.fontSize(8).font('fonts/NunitoSans-Light.ttf')
            .text(`Reporte semanal No. ${day}-${week}-${year}    Semana: ${week}  Año: ${year}   Fecha del reporte: ${fecha}`, 233, 78, { width: 500, align: 'justify' })
            doc.moveDown()

            doc.image('images/logo/conabio3.png', 37, 39, { width: 65 })
            doc.moveDown()
            doc.font('fonts/candara.ttf').fontSize(11)
            doc.fontSize(8).text('Fecha impresión: ' + fechaImpre, 435, 20, { width: 500, align: 'justify' })

            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .fillColor('#a61c00')
            .text('SATcoral - Sistema satelital de alerta temprana de blanqueamiento de coral', 115, 45, { width: 490, align: 'left' })

            doc.fillColor('black')
            .font('fonts/NunitoSans-Light.ttf')
            .text('Sistema de Información y Análisis de Ecosistemas Marinos de México - SIMAR', { width: 500, align: 'justify' })
            doc.rect(110, 90, 450, .1).dash(0.2, { space: 0 }).stroke()

            doc.fontSize(8).font('fonts/NunitoSans-Light.ttf')
            .text(`Reporte semanal No. ${day}-${week}-${year}    Semana: ${week}  Año: ${year}   Fecha del reporte: ${fecha}`, 233, 78, { width: 500, align: 'justify' })
            doc.moveDown()

            doc.image(whs_img, 45, 130, { width: 530 })
            doc.fontSize(9).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fig. 5. WHS: `,195, 395, { width: 495, align: 'justify',continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`HotSpot semanal de blanqueamiento de corales`)

            doc.image(wynsst_img, 45, 430, { width: 530 })
            doc.fontSize(9).font('fonts/NunitoSans-SemiBold.ttf')
            .text(`Fig. 6. WY-NSST: `,160, 695, { width: 495, align: 'justify',continued: true})
            .font('fonts/NunitoSans-Light.ttf')
            .text(`Temperatura superficial del mar nocturna 7-días-semanas-año`)

            doc.fontSize(10).text('Pag. 3/4', 530, 720, { width: 200, align: 'left' })
            doc.addPage()

            //++++++++++++++++++++++++++++++++++++++página 4
            doc.image('images/logo/conabio3.png', 37, 39, { width: 65 })
            doc.moveDown()
            doc.font('fonts/candara.ttf').fontSize(11)
            doc.fontSize(8).text('Fecha impresión: ' + fechaImpre, 435, 20, { width: 500, align: 'justify' })
            doc.fontSize(13).font('fonts/NunitoSans-SemiBold.ttf')
            .fillColor('#a61c00')
            .text('SATcoral - Sistema satelital de alerta temprana de blanqueamiento de coral', 115, 45, { width: 490, align: 'left' })
            doc.fillColor('black')
            .font('fonts/NunitoSans-Light.ttf')
            .text('Sistema de Información y Análisis de Ecosistemas Marinos de México - SIMAR', { width: 500, align: 'justify' })
            doc.rect(110, 90, 450, .1).dash(0.2, { space: 0 }).stroke()
            doc.fontSize(8).font('fonts/NunitoSans-Light.ttf')
            .text(`Reporte semanal No. ${day}-${week}-${year}    Semana: ${week}  Año: ${year}   Fecha del reporte: ${fecha}`, 233, 78, { width: 500, align: 'justify' })
            doc.moveDown()

            let resumen = `
            Este reporte semanal se emite de cada lunes y forma parte del sistema satelital de alerta temprana de blanqueamiento de corales (SATcoral  | Conabio) a 1-km de resolución espacial, dentro del sistema de información y análisis de ecosistemas marinos de México (SIMAR | CONABIO), diseñado e implementado por la Coordinación de Monitoreo Marino de la Comisión Nacional para el Conocimiento y uso de la Biodiversidad (Conabio) en México.            
      `
            let resumen2 = `
            Productos SATcoral | Conabio:
            WY-NSST: Temperatura superficial del mar nocturna 7-días-semanas-año. (Fig. 6)
            NOAA-M-NSST-C: Climatología mensual ajustada de la temperatura superficial del mar nocturna (1985-2012)
            WHS: HotSpot semanal de blanqueamiento de corales (Fig. 5)       |        DHW: Grado de calentamiento semanal sobre el coral (Fig. 4)
            SBA: Alerta satelital de blanqueamiento de corales (Fig. 3)              |      R-SBA: Alerta satelital regional de blanqueamiento de corales (Fig. 1)            
            
            Cada producto puede ser consultado en: SIMAR-CONABIO   |    Mares Mexicanos-Conabio.
            `
            let resumen3=`La alerta satelital de blanqueamiento de corales (SBA) es un producto semanal (cada 7 días o semanas del año natural) que se genera cada lunes y está basado en el estrés térmico en corales. Se visualiza mediante 5 niveles de alerta con colores asociados y valores entre 1-5 (Tabla 1).
            `
            doc.fontSize(12).text('Resumen de la metodología', 60, 305, { width: 290, align: 'left' })
            doc.fontSize(8).text(resumen, 60, 320, { width: 490, align: 'left' })
            doc.fontSize(7).text(resumen2, 65, 370, { width: 490, align: 'left' })
            doc.image('images/logo/resumenT1.png', 45, 460, { width: 550 })
            doc.image('images/logo/logo2.png', 65, 650, { width: 65 })
            doc.rect(140, 690, 330, 1).dash(0.2, { space: 0 }).stroke()
            doc.font('fonts/NunitoSans-Light.ttf')
            
            .fontSize(9).text('Producido por: ', 140, 640, { width: 490, align: 'left',continued: true})
            .fillColor('blue')
            .text('Monitoreo Marino', { underline: true, link: 'http://www.biodiversidad.gob.mx/mares',continued: true })
            .fillColor('black')
            .text('  |  ',{continued: true,underline: false})
            .fillColor('blue')
            .text('Conabio', { underline: true, link: 'http://www.conabio.gob.mx'})
            doc.moveDown()

            doc.font('fonts/NunitoSans-Light.ttf').fillColor('black')
            .fontSize(9).text('Plataforma web Conabio: ', 140, 652, { width: 490, align: 'left',continued: true})
            .fillColor('blue')
            .text('SIMAR', { underline: true, link: 'http://simar.conabio.gob.mx/mares',continued: true })
            .fillColor('black')
            .text('  |  ',{continued: true,underline: false})
            .fillColor('blue')
            .text('SATcoral', { underline: true, link: 'http://www.biodiversidad.gob.mx/mares/simar/satcoral',continued: true })
            .fillColor('black')
            .text('  |  ',{continued: true,underline: false})
            .fillColor('blue')
            .text('simar.conabio.gob.mx', { underline: true, link: 'http://www.conabio.gob.mx' })
            doc.moveDown()

            doc.fontSize(9).fillColor('black')
            .text('Liga Periférico-Insurgentes Sur 4903, Parques del Pedregal, 14010, Tlalpan, CdMx', 140, 665, { width: 490, align: 'left' })
            doc.fontSize(9).fillColor('blue')
            .text('simar@conabio.gob.mx', 140, 675, { width: 450, align: 'left',continued: true,underline: false })
            .fillColor('black')
            .text('  +52 55 5004 5000',{underline: false})

            doc.image('images/logo/semarnat.png', 140, 700, { width: 70 })
            doc.image('images/logo/conabio2.png', 230, 702, { width: 70 })
            doc.image('images/logo/conap2.png', 315, 700, { width: 50 })
            doc.image('images/logo/gef.png', 385, 700, { width: 20 })
            doc.image('images/logo/pnud.png', 430, 700, { width: 25 })
            doc.image('images/logo/simar.png', 480, 680, { width: 110 })
            doc.fontSize(10).text('Pag. 4/4', 530, 725, { width: 450, align: 'left' })

            //------------------
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=SATCORAL_${fecha}.pdf`);
            doc.pipe(res)
                .on('finish', function () {
                    console.log('PDF ' + fecha);
                });
            doc.end();
        })
}

module.exports = {
    get
}