const fs = require("fs");
const photoHelper = require("../middleware/photo.helper");

const createMeme = async (req, res, next) => {
    try {
        // Read data from the json file
        let rawData = fs.readFileSync("memes.json");
        let memes = JSON.parse(rawData).memes;

        const meme = {};

        const texts = req.body.text || [];
        // const texts = JSON.parse(req.body.text) || [];
        console.log({ texts, hi: req.body.text })
        const textsArr = [].concat(texts); // Make sure texts is an array.
        meme.texts = textsArr.map((text) => JSON.parse(text));
        // meme.texts = textsArr;
        console.log({ meme: meme.texts })

        // Prepare data for the new meme
        meme.id = Date.now();
        meme.originalImage = req.file.filename;
        meme.originalImagePath = req.file.path;
        const newFilename = `MEME_${meme.id}`;
        const newDirectory = req.file.destination;
        const newFilenameExtension = meme.originalImage.split(".").slice(-1);
        meme.outputMemePath = `${newDirectory}/${newFilename}.${newFilenameExtension}`;

        // Put text on image
        await photoHelper.putTextOnImage(
            meme.originalImagePath,
            meme.outputMemePath,
            meme.texts
        );

        // Add the new meme to the beginning of the list and save to the json file
        meme.createdAt = Date.now();
        meme.updatedAt = Date.now();
        memes.unshift(meme);
        fs.writeFileSync("memes.json", JSON.stringify({ memes }));
        res.status(201).json({ data: meme });
    } catch (err) {
        next(err);
    }
};

const getMemes = (req, res, next) => {
    try {
        let rawData = fs.readFileSync("memes.json");
        let memes = JSON.parse(rawData).memes;

        res.json({ data: memes })
    } catch (error) {

    }
};

module.exports = {
    createMeme,
    getMemes
};