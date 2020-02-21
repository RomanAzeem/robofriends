const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

//@route   GET api/profile/me
//@desc    Get current user profile
//@access  Private

router.get('/me', auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      res.status(400).json('There is no such Profile');
    }
    res.json(profile);
  } catch (err) {
    console.error(err.messsage);
    res.status(500).json('Server Error');
  }
});

//@route POST api/profile
//@desc Create or update user Profile
//@access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errros: errors.array() });
      }
      ///destruct the profile req.body enteties
      const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        twitter,
        youtube,
        facebook,
        instagram,
        linkedin
      } = req.body;

      //build the profile objets
      const profileFields = {};
      profileFields.user = req.user.id;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (githubusername) profileFields.githubusername = githubusername;
      if (status) profileFields.status = status;
      if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
      }

      //build social objects
      profileFields.social = {};
      if (twitter) profileFields.social.twitter = twitter;
      if (youtube) profileFields.social.youtube = youtube;
      if (facebook) profileFields.social.facebook = facebook;
      if (instagram) profileFields.social.instagram = instagram;
      if (linkedin) profileFields.social.linkedin = linkedin;
      try {
        ///check if user exists
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
          profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          );

          return res.json(profile);
        }
        ///create new profile
        else {
          profile = new Profile(profileFields);
          await profile.save();
          res.json(profile);
        }
      } catch (error) {
        console.error(error);
        res.status(500).json(error);
      }
    } catch (err) {
      console.error(err.messsage);
    }
  }
);

//@route Get api/profile
//@desc Get All Users Profile
//@access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.messsage);
    res.status(500).json('Server Error');
  }
});

//@route Get api/profile/:id
//@desc Get All Users Profile
//@access Public
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);
    if (!profile)
      res.status(400).json({ msg: 'There is no Profile for such User' });
    res.json(profile);
  } catch (error) {
    console.error(error.messsage);
    res.status(500).json('Server Error');
  }
});

module.exports = router;
