const User = require('../models/User');
const { main } = require('../utils/AiResponse');
const createFilesFromJSON = require('../utils/convertResponseTofile');
const runDockerfile = require('../utils/RunCode');
const path = require('path');


const chat = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Message is required' });

        }
        const useId = req.user.id;
        if (!useId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(useId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const Response = await main(message, history);

        if (!Response) {
            return res.status(400).json({ message: 'Error in response' });
        }

        const projectDir = await createFilesFromJSON(Response,path.join(__dirname,'../storage'));

        const url= await runDockerfile(projectDir, 'my-docker-image', 'my-container-name',Response?.Port);

 


        res.status(200).send({ ...Response, url: `http://localhost:${Response?.Port}` });



    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: 'Error processing chat request' });
    }
};

module.exports = { chat };
