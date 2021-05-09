import formidable from 'formidable';
import fs from 'fs';
import csvParser from 'csv-parser';
const toCsvParser = require('json2csv').Parser;

const API_KEY = process.env.GOOGLE_API_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

const post = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
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
      const csvFields = [
        ...Object.keys(result[0]),
        'LAT',
        'LNG',
        'FORMATTED ADDRESS',
      ];
      const resultsPromises = result.map((address) => getLangLat(address));
      Promise.all(resultsPromises)
        .then((values) => {
          const formattedResult = formatResult(result, values);
          const csvParser = new toCsvParser({ csvFields });
          const csvData = csvParser.parse(formattedResult);
          res.setHeader('Content-Type', 'text/csv; charset="UTF-8-BOM"');
          res.setHeader('Content-Disposition', 'attachment; filename=geo.csv');
          res.status(200).end(csvData);
        })
        .catch((e) => {
          console.log('error occured', e);
          res.status(400).end('Error Occured');
        });
    });
};

function formatResult(result, geoResponse) {
  return result.map((address, i) => {
    const geoResult = geoResponse[i][0];
    if (geoResult) {
      address.LAT = geoResult.geometry.location.lat;
      address.LNG = geoResult.geometry.location.lng;
      address['FORMATTED ADDRESS'] = geoResult.formatted_address;
    } else {
      address.LAT = 'ERROR_OCCURED';
      address.LNG = 'ERROR_OCCURED';
      address['FORMATTED ADDRESS'] = 'ERROR_OCCURED';
    }
    return address;
  });
}

async function getLangLat(address) {
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${Object.values(
        address
      ).join(',')}&key=${API_KEY}`
    );
    const data = await res.json();
    return data.results;
  } catch (e) {
    console.log('Error fetching from google:', e);
    return [];
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
