const CMS = require('../models/CMS');

const getCmsByKey = async (req, res) => {
  try {
    const cms = await CMS.findOne({ key: req.params.key });
    if (cms) {
      res.json(cms);
    } else {
      res.status(404).json({ message: `CMS page for key '${req.params.key}' not found` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCmsByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { title, content } = req.body;

    let cms = await CMS.findOne({ key });

    if (cms) {
      cms.title = title !== undefined ? title : cms.title;
      cms.content = content !== undefined ? content : cms.content;
      cms = await cms.save();
    } else {
      cms = new CMS({ key, title, content });
      cms = await cms.save();
    }

    res.json(cms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCmsByKey,
  updateCmsByKey,
};
