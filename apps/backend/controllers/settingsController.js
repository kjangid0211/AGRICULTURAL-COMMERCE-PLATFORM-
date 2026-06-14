const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      const { websiteName, logoPlaceholder, defaultMode, contactEmail, contactPhone, address, socialLinks, themeDetails } = req.body;
      
      settings.websiteName = websiteName !== undefined ? websiteName : settings.websiteName;
      settings.logoPlaceholder = logoPlaceholder !== undefined ? logoPlaceholder : settings.logoPlaceholder;
      settings.defaultMode = defaultMode !== undefined ? defaultMode : settings.defaultMode;
      settings.contactEmail = contactEmail !== undefined ? contactEmail : settings.contactEmail;
      settings.contactPhone = contactPhone !== undefined ? contactPhone : settings.contactPhone;
      settings.address = address !== undefined ? address : settings.address;
      
      if (socialLinks) {
        settings.socialLinks = {
          facebook: socialLinks.facebook !== undefined ? socialLinks.facebook : settings.socialLinks.facebook,
          twitter: socialLinks.twitter !== undefined ? socialLinks.twitter : settings.socialLinks.twitter,
          instagram: socialLinks.instagram !== undefined ? socialLinks.instagram : settings.socialLinks.instagram,
          linkedin: socialLinks.linkedin !== undefined ? socialLinks.linkedin : settings.socialLinks.linkedin,
        };
      }
      
      if (themeDetails) {
        settings.themeDetails = themeDetails;
      }
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
