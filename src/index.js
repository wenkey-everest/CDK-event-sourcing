const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = (event) => {
  event.Records.forEach((record) => {
    const params = {
      Bucket: "targetstack-storebuckete062d34b-qu340m9l0ahc",
      Key: record.messageId + ".json",
      ContentType: "application/json",
      Body: record.body,
    };
    s3.putObject(params)
      .promise()
      .then((data) => {
        console.log("complete:PUT Object", data);
      })
      .catch((err) => {
        console.log("failure:PUT Object", err);
      });
  });
};
