
import fs = require('fs');
import csv = require('csv-parser');


interface IMessage{
	res: any,
	message?: string | any,
}


export async function success({res, message}: IMessage){
	await res.status(200).send(message || 'Success')
}

export async function error({res, message}: IMessage){
	await res.status(401).send(message || 'Error');
}

export function isEmptyObject(object) {
	return JSON.stringify(object) === "{}"
}


export function readErrorMessagesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const errorMessages = {};

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        errorMessages[row.error_code] = row.error_message;
      })
      .on('end', () => {
        resolve(errorMessages);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
