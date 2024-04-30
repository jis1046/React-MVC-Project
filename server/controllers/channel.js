const models = require('../models');
const { Account } = models;

const channelPage = (req, res) => res.render('channel');

const togglePremium = async (req, res) => {
    try{
        const doc = await Account.findByIdAndUpdate(
            req.session.account._id,
            { premium: !req.session.account.premium },
            { returnDocument: 'after' }
        ).exec();

        req.session.account = Account.toApi(doc);
        return res.status(200).json({premium: req.session.account.premium});
    }
    catch (err) { 
        console.error(err);
        return res.status(500).json({error: 'Premium not updated'});
    }
};


module.exports = {
    channelPage,
    togglePremium
}