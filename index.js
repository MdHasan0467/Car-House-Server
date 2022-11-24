const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;



app.get('/', (req, res) => {
    res.send('Assignment Twelve Server Is Running!! ')
});



app.listen(port, () => {
    console.log(`Twelve Server is running on  port ${port}`);
})