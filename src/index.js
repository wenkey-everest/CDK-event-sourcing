exports.handler = async (event) => {
    event.Records.forEach((record) => {
        // Prints over all body in the request
            console.log(record.body)
        })
    }