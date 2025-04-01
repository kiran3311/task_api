const xml2js = require('xml2js');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const xmlCrypto = require('xml-crypto');
const BaseDetailsModel = require('../models/BaseDetailsModel');

exports.addDetailsByBaseHelper = async (data) => {
    try {

        const newData = {
            accNo: data.accNo,
            aadhaar: data.accNo,
            ifsc: data.accNo,
            iin: data.accNo,
            micr: data.accNo,
            custConsent: data.accNo,
            previousIIN: data.accNo,
            filler1: data.accNo,
            filler2: data.accNo,
            uid: data.accNo,
            tkn: data.accNo,
            name: data.accNo,
            dob: data.accNo,
            gender: data.accNo,
            photoOfResident: data.accNo,
            signedAadhaarLetterInPdfFormat: data.accNo,
            NpciRefId: data.accNo,
            kycDetails: {
            },
        };
    } catch (error) {
        console.log(error)
    }
}
exports.parseXML = (xmlData) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

exports.decryptedXMLdata = (xmlData) => {

    // Load private key for signing
    const privateKey = fs.readFileSync('private-key.pem', 'utf-8');

    // Load XML data (replace with your actual XML content)

    // Sign XML using RSA-SHA256
    const signer = new xmlCrypto.SignatureAlgorithm.RsaSha256();
    signer.signObject({ id: 'objectId', }, {}, xmlData, privateKey);

    // Encrypted XML using RSA/ECB/PKCS1Padding
    const publicKey = fs.readFileSync('public-key.pem', 'utf-8');
    const encryptedXml = encryptXml(xmlData, publicKey);

    // Save the signed and encrypted XML


    console.log('XML signed and encrypted successfully.');

    return encryptXml

}

// Function to encrypt XML data
function encryptXml(xmlData, publicKey) {
    const buffer = Buffer.from(xmlData, 'utf-8');
    const encryptedBuffer = crypto.publicEncrypt(
        { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
        buffer
    );
    return encryptedBuffer.toString('base64');
}