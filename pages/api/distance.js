import formidable from 'formidable';
import fs from 'fs';
import csvParser from 'csv-parser';
import getDistance from 'geolib/es/getDistance';
import convertDistance from 'geolib/es/convertDistance';
const toCsvParser = require('json2csv').Parser;

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log('Unable to Parse file');
    }
    processFile(files.file, res);
  });
};

const processFile = (file, res) => {
  const result = [];
  fs.createReadStream(file.path)
    .on('error', () => {
      console.log('unable to read file');
      res.status(400).end('unable to read file');
    })
    .pipe(csvParser())
    .on('data', (row) => {
      result.push(row);
    })
    .on('end', async () => {
      const csvFields = [...Object.keys(result[0]), 'DISTANCE'];
      const distanceArray = result.map((address) => calcDistance(address));
      const csvParser = new toCsvParser({ csvFields });
      const csvData = csvParser.parse(distanceArray);
      res.setHeader('Content-Type', 'text/csv; charset="UTF-8-BOM"');
      res.setHeader('Content-Disposition', 'attachment; filename=distance.csv');
      res.status(200).end(csvData);
    });
};

function calcDistance(coord) {
  try {
    var z = Object.values(coord);
    var d = convertDistance(
      getDistance(
        { latitude: z[0], longitude: z[1] },
        { latitude: z[2], longitude: z[3] }
      ),
      'mi'
    );
    coord.DISTANCE = d;
    return coord;
  } catch (e) {
    console.log('Error calculating distance : ', address, ' Error: ', e);
    coord.DISTANCE = 'ERROR';
    return coord;
  }
}
export default (req, res) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'PUT'
    ? console.log('PUT')
    : req.method === 'DELETE'
    ? console.log('DELETE')
    : req.method === 'GET'
    ? console.log('GET')
    : res.status(404).send('');
};
