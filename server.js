const express = require("express");

const app = express();

app.use(express.static(`${__dirname}/public`));

app.listen(9000, () => {
	console.log(`listening on 9000...`);
});
