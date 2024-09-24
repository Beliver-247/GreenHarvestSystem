const axios = require("axios");
const convertImageToBase64 = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      return `data:${response.headers['content-type']};base64,${base64Image}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      // Return a default image if there's an error
      return null;
    }
  };

  module.exports =convertImageToBase64;